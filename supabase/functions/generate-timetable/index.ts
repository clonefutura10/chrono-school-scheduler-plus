
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  subjects: string[];
  max_hours_per_day: number;
  preferences: string;
  availability: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }[];
}

interface Class {
  id: string;
  name: string;
  grade: string;
  section: string;
  capacity: number;
  periods_per_day: number;
  periods_per_week: number;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Starting timetable generation...');

    // Fetch all necessary data from Supabase
    const [teachersRes, classesRes, subjectsRes, availabilityRes] = await Promise.all([
      supabaseClient.from('teachers').select('*'),
      supabaseClient.from('classes').select('*'),
      supabaseClient.from('subjects').select('*'),
      supabaseClient.from('availability').select('*')
    ]);

    if (teachersRes.error) throw teachersRes.error;
    if (classesRes.error) throw classesRes.error;
    if (subjectsRes.error) throw subjectsRes.error;
    if (availabilityRes.error) throw availabilityRes.error;

    const teachers: Teacher[] = teachersRes.data.map(teacher => ({
      ...teacher,
      availability: availabilityRes.data.filter(av => av.teacher_id === teacher.id)
    }));

    const classes: Class[] = classesRes.data;
    const subjects: Subject[] = subjectsRes.data;

    console.log(`Found ${teachers.length} teachers, ${classes.length} classes, ${subjects.length} subjects`);

    // Prepare data for Groq API
    const schedulePrompt = `
Generate a weekly school timetable with the following constraints:

TEACHERS:
${teachers.map(t => `- ${t.first_name} ${t.last_name}: Subjects [${Array.isArray(t.subjects) ? t.subjects.join(', ') : 'General'}], Max ${t.max_hours_per_day || 4} hours/day, Available: ${t.availability.filter(a => a.is_available).map(a => `${a.day_of_week} ${a.start_time}-${a.end_time}`).join(', ')}`).join('\n')}

CLASSES:
${classes.map(c => `- ${c.name} (Grade ${c.grade}${c.section ? '-' + c.section : ''}): ${c.periods_per_day || 7} periods/day`).join('\n')}

SUBJECTS:
${subjects.map(s => `- ${s.name} (${s.code || 'N/A'})`).join('\n')}

REQUIREMENTS:
1. Generate a complete weekly timetable for all classes
2. Ensure no teacher conflicts (same teacher can't be in two places at once)
3. Respect teacher availability windows
4. Balance teacher workload fairly
5. Each class should have ${classes[0]?.periods_per_day || 7} periods per day
6. Working days: Monday to Friday
7. Time slots: 8:00-8:40, 8:45-9:25, 9:30-10:10, 10:30-11:10, 11:15-11:55, 12:00-12:40, 1:20-2:00

Return ONLY a JSON object in this exact format:
{
  "success": true,
  "timetable": [
    {
      "class_id": "class_uuid",
      "class_name": "Class 10-A",
      "day_of_week": "Monday",
      "period_number": 1,
      "time_slot": "8:00-8:40",
      "subject_id": "subject_uuid",
      "subject_name": "Mathematics",
      "teacher_id": "teacher_uuid",
      "teacher_name": "John Doe",
      "room_number": "Room 101"
    }
  ]
}`;

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a school timetable scheduling expert. Generate conflict-free timetables that respect all constraints. Always return valid JSON.'
          },
          {
            role: 'user',
            content: schedulePrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('Groq response received');

    let timetableData;
    try {
      const content = groqData.choices[0].message.content;
      // Extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      timetableData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
      // Generate fallback timetable
      timetableData = generateFallbackTimetable(teachers, classes, subjects);
    }

    // Clear existing timetables
    await supabaseClient.from('timetables').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Save generated timetable to Supabase
    if (timetableData.success && timetableData.timetable) {
      const timetableInserts = timetableData.timetable.map((entry: any) => ({
        class_id: entry.class_id,
        day_of_week: entry.day_of_week,
        period_number: entry.period_number,
        subject_id: entry.subject_id,
        teacher_id: entry.teacher_id,
        room_number: entry.room_number || 'TBA',
        schedule_data: {
          time_slot: entry.time_slot,
          subject_name: entry.subject_name,
          teacher_name: entry.teacher_name,
          class_name: entry.class_name
        }
      }));

      const { error: insertError } = await supabaseClient
        .from('timetables')
        .insert(timetableInserts);

      if (insertError) {
        console.error('Failed to save timetable:', insertError);
        throw insertError;
      }

      console.log(`Saved ${timetableInserts.length} timetable entries`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Timetable generated successfully',
        data: timetableData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating timetable:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateFallbackTimetable(teachers: Teacher[], classes: Class[], subjects: Subject[]) {
  console.log('Generating fallback timetable...');
  
  const timeSlots = [
    '8:00-8:40', '8:45-9:25', '9:30-10:10', '10:30-11:10', 
    '11:15-11:55', '12:00-12:40', '1:20-2:00'
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const timetable = [];
  let teacherAssignments: { [key: string]: number } = {};
  
  for (const classObj of classes) {
    for (const day of days) {
      for (let period = 1; period <= (classObj.periods_per_day || 7); period++) {
        // Simple round-robin assignment
        const teacherIndex = (timetable.length) % teachers.length;
        const subjectIndex = (timetable.length) % subjects.length;
        const teacher = teachers[teacherIndex];
        const subject = subjects[subjectIndex];
        
        if (teacher && subject) {
          timetable.push({
            class_id: classObj.id,
            class_name: classObj.name,
            day_of_week: day,
            period_number: period,
            time_slot: timeSlots[period - 1] || '8:00-8:40',
            subject_id: subject.id,
            subject_name: subject.name,
            teacher_id: teacher.id,
            teacher_name: `${teacher.first_name} ${teacher.last_name}`,
            room_number: `Room ${100 + period}`
          });
        }
      }
    }
  }
  
  return {
    success: true,
    timetable,
    fallback: true
  };
}
