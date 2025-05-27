
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TeacherData {
  id: string;
  first_name: string;
  last_name: string;
  subjects: string[];
  max_hours_per_day: number;
  availability: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }[];
}

interface ClassData {
  id: string;
  name: string;
  grade: string;
  section: string;
  periods_per_day: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    console.log('Starting timetable generation...');

    // Fetch all teachers with their availability
    const { data: teachers, error: teachersError } = await supabaseClient
      .from('teachers')
      .select(`
        id, first_name, last_name, subjects, max_hours_per_day,
        availability (day_of_week, start_time, end_time, is_available)
      `);

    if (teachersError) {
      console.error('Error fetching teachers:', teachersError);
      throw teachersError;
    }

    // Fetch all classes
    const { data: classes, error: classesError } = await supabaseClient
      .from('classes')
      .select('id, name, grade, section, periods_per_day');

    if (classesError) {
      console.error('Error fetching classes:', classesError);
      throw classesError;
    }

    // Fetch all subjects
    const { data: subjects, error: subjectsError } = await supabaseClient
      .from('subjects')
      .select('id, name, code');

    if (subjectsError) {
      console.error('Error fetching subjects:', subjectsError);
      throw subjectsError;
    }

    // Fetch time slots
    const { data: timeSlots, error: timeSlotsError } = await supabaseClient
      .from('time_slots')
      .select('id, name, start_time, end_time, type')
      .order('start_time');

    if (timeSlotsError) {
      console.error('Error fetching time slots:', timeSlotsError);
      throw timeSlotsError;
    }

    console.log(`Fetched ${teachers?.length} teachers, ${classes?.length} classes, ${subjects?.length} subjects`);

    // Prepare data for Groq API
    const schedulingData = {
      teachers: teachers?.map(teacher => ({
        id: teacher.id,
        name: `${teacher.first_name} ${teacher.last_name}`,
        subjects: teacher.subjects || ['General'],
        maxHoursPerDay: teacher.max_hours_per_day || 4,
        availability: teacher.availability || []
      })) || [],
      classes: classes?.map(cls => ({
        id: cls.id,
        name: cls.name,
        grade: cls.grade,
        section: cls.section,
        periodsPerDay: cls.periods_per_day || 7
      })) || [],
      subjects: subjects || [],
      timeSlots: timeSlots || [],
      constraints: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        periodsPerDay: 7,
        avoidDoubleBooking: true,
        balanceTeacherLoad: true
      }
    };

    // Call Groq API for intelligent scheduling
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are an expert school timetable scheduler. Generate a complete weekly timetable that:
            1. Assigns teachers to classes based on their subjects and availability
            2. Ensures no teacher has conflicting time slots
            3. Balances workload fairly across teachers
            4. Respects teacher availability and max hours per day
            5. Returns a JSON array of timetable entries in this format:
            [
              {
                "class_id": "class_uuid",
                "teacher_id": "teacher_uuid", 
                "subject_id": "subject_uuid",
                "day_of_week": "Monday",
                "period_number": 1,
                "time_slot_id": "slot_uuid",
                "room_number": "A101"
              }
            ]`
          },
          {
            role: "user",
            content: `Generate a timetable for this school data: ${JSON.stringify(schedulingData)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!groqResponse.ok) {
      console.error('Groq API error:', await groqResponse.text());
      throw new Error('Failed to generate timetable with Groq');
    }

    const groqResult = await groqResponse.json();
    console.log('Groq response received');

    // Parse the AI-generated timetable
    let generatedTimetable;
    try {
      const content = groqResult.choices[0].message.content;
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      generatedTimetable = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing Groq response:', parseError);
      // Fallback: generate a basic timetable
      generatedTimetable = generateFallbackTimetable(classes, teachers, subjects, timeSlots);
    }

    // Clear existing timetable entries
    await supabaseClient.from('timetables').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert the new timetable entries
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('timetables')
      .insert(generatedTimetable.map((entry: any) => ({
        ...entry,
        schedule_data: { generated_by: 'groq_ai', generated_at: new Date().toISOString() }
      })));

    if (insertError) {
      console.error('Error inserting timetable:', insertError);
      throw insertError;
    }

    console.log(`Successfully generated and saved ${generatedTimetable.length} timetable entries`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Timetable generated successfully',
        entriesCount: generatedTimetable.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-timetable function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function generateFallbackTimetable(classes: any[], teachers: any[], subjects: any[], timeSlots: any[]) {
  const timetable = [];
  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  for (const cls of classes || []) {
    for (const day of workingDays) {
      for (let period = 1; period <= (cls.periods_per_day || 7); period++) {
        // Simple round-robin assignment
        const teacherIndex = (period - 1) % (teachers?.length || 1);
        const subjectIndex = (period - 1) % (subjects?.length || 1);
        const timeSlotIndex = (period - 1) % (timeSlots?.length || 1);
        
        if (teachers?.[teacherIndex] && subjects?.[subjectIndex] && timeSlots?.[timeSlotIndex]) {
          timetable.push({
            class_id: cls.id,
            teacher_id: teachers[teacherIndex].id,
            subject_id: subjects[subjectIndex].id,
            day_of_week: day,
            period_number: period,
            time_slot_id: timeSlots[timeSlotIndex].id,
            room_number: `Room ${period}`
          });
        }
      }
    }
  }
  
  return timetable;
}
