import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimetableCell } from './TimetableCell';
import { supabase } from '@/integrations/supabase/client';

// Keep the same time slots and weekdays
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '8:00 - 8:40',
  '8:45 - 9:25',
  '9:30 - 10:10',
  '10:10 - 10:30', // Break
  '10:30 - 11:10',
  '11:15 - 11:55',
  '12:00 - 12:40',
  '12:40 - 1:20', // Lunch Break
  '1:20 - 2:00',
];

interface ClassInfo {
  day: string;
  timeSlot: string;
  subject: string;
  teacher: string;
  room: string;
  grade: string;
  division: string;
}

interface DailyTimetableProps {
  grade?: string;
  division?: string;
}

export function DailyTimetable({ grade = '10', division = 'A' }: DailyTimetableProps) {
  const [timetableData, setTimetableData] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetableData();
  }, [grade, division]);

  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      
      // Fetch timetable data from Supabase
      const { data: timetables, error } = await supabase
        .from('timetables')
        .select(`
          *,
          teachers(first_name, last_name),
          subjects(name),
          classes(grade, section)
        `)
        .eq('classes.grade', `Class ${grade}`)
        .eq('classes.section', division);

      if (error) {
        console.error('Error fetching timetable:', error);
        // Fall back to generated data if no real data exists
        setTimetableData(generateFallbackData());
        return;
      }

      if (timetables && timetables.length > 0) {
        // Transform Supabase data to match existing structure
        const transformedData = timetables.map((item: any) => ({
          day: item.day_of_week,
          timeSlot: getTimeSlotByPeriod(item.period_number),
          subject: item.subjects?.name || 'General',
          teacher: item.teachers ? `${item.teachers.first_name} ${item.teachers.last_name}` : 'Staff',
          room: item.room_number || 'Room 101',
          grade: grade,
          division: division,
        }));
        setTimetableData(transformedData);
      } else {
        // Generate fallback data if no timetables exist
        setTimetableData(generateFallbackData());
      }
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      setTimetableData(generateFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotByPeriod = (periodNumber: number) => {
    const timeSlotMap = {
      1: '8:00 - 8:40',
      2: '8:45 - 9:25', 
      3: '9:30 - 10:10',
      4: '10:30 - 11:10',
      5: '11:15 - 11:55',
      6: '12:00 - 12:40',
      7: '1:20 - 2:00',
    };
    return timeSlotMap[periodNumber as keyof typeof timeSlotMap] || '8:00 - 8:40';
  };

  const generateFallbackData = () => {
    // Keep the same fallback generation logic as before
    const fallbackData: ClassInfo[] = [];
    const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Physical Education'];
    const teachers = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Jessica Lee', 'David Wilson'];
    
    WEEKDAYS.forEach((day, dayIndex) => {
      TIME_SLOTS.forEach((timeSlot, slotIndex) => {
        if (timeSlot !== '10:10 - 10:30' && timeSlot !== '12:40 - 1:20') {
          const subjectIndex = (dayIndex * 7 + slotIndex) % subjects.length;
          const teacherIndex = (dayIndex * 7 + slotIndex) % teachers.length;
          
          fallbackData.push({
            day: day,
            timeSlot: timeSlot,
            subject: subjects[subjectIndex],
            teacher: teachers[teacherIndex],
            room: `Room ${101 + (slotIndex % 5)}`,
            grade: grade,
            division: division,
          });
        }
      });
    });
    
    return fallbackData;
  };

  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    return timetableData.find(
      (cls) => cls.day === day && cls.timeSlot === timeSlot
    );
  };

  const isBreak = (timeSlot: string) => {
    return timeSlot === '10:10 - 10:30' || timeSlot === '12:40 - 1:20';
  };

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardHeader className="bg-school-50 border-b">
          <CardTitle className="text-center text-school-900">
            Grade {grade} - Division {division} Timetable
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading timetable...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-school-50 border-b">
        <CardTitle className="text-center text-school-900">
          Grade {grade} - Division {division} Timetable
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-6 gap-2">
          {/* Time column */}
          <div className="col-span-1">
            <div className="h-10 flex items-center justify-center font-medium bg-school-100 rounded mb-2">
              Time
            </div>
            {TIME_SLOTS.map((timeSlot) => (
              <div
                key={timeSlot}
                className="timetable-cell flex items-center justify-center"
              >
                <div className="class-time font-medium text-sm">{timeSlot}</div>
              </div>
            ))}
          </div>

          {/* Days columns */}
          {WEEKDAYS.map((day) => (
            <div key={day} className="col-span-1">
              <div className="h-10 flex items-center justify-center font-medium bg-school-100 rounded mb-2">
                {day}
              </div>
              {TIME_SLOTS.map((timeSlot) => {
                const classInfo = getClassForTimeSlot(day, timeSlot);
                const isBreakSlot = isBreak(timeSlot);

                return (
                  <TimetableCell
                    key={`${day}-${timeSlot}`}
                    classInfo={classInfo}
                    isBreak={isBreakSlot}
                    breakName={isBreakSlot ? (timeSlot === '10:10 - 10:30' ? 'Break' : 'Lunch Break') : ''}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
