
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimetableCell } from './TimetableCell';
import { subjectAllocationData } from '@/data/schoolData';

// Sample data for the timetable
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

// Generate comprehensive class data from school data
const generateTimetableData = () => {
  const timetableData = [];
  
  // Create a schedule for each grade/division combination
  const scheduleTemplates = {
    'Monday': [
      { timeSlot: '8:00 - 8:40', period: 1 },
      { timeSlot: '8:45 - 9:25', period: 2 },
      { timeSlot: '9:30 - 10:10', period: 3 },
      { timeSlot: '10:30 - 11:10', period: 4 },
      { timeSlot: '11:15 - 11:55', period: 5 },
      { timeSlot: '12:00 - 12:40', period: 6 },
      { timeSlot: '1:20 - 2:00', period: 7 },
    ],
    'Tuesday': [
      { timeSlot: '8:00 - 8:40', period: 1 },
      { timeSlot: '8:45 - 9:25', period: 2 },
      { timeSlot: '9:30 - 10:10', period: 3 },
      { timeSlot: '10:30 - 11:10', period: 4 },
      { timeSlot: '11:15 - 11:55', period: 5 },
      { timeSlot: '12:00 - 12:40', period: 6 },
      { timeSlot: '1:20 - 2:00', period: 7 },
    ],
    'Wednesday': [
      { timeSlot: '8:00 - 8:40', period: 1 },
      { timeSlot: '8:45 - 9:25', period: 2 },
      { timeSlot: '9:30 - 10:10', period: 3 },
      { timeSlot: '10:30 - 11:10', period: 4 },
      { timeSlot: '11:15 - 11:55', period: 5 },
      { timeSlot: '12:00 - 12:40', period: 6 },
      { timeSlot: '1:20 - 2:00', period: 7 },
    ],
    'Thursday': [
      { timeSlot: '8:00 - 8:40', period: 1 },
      { timeSlot: '8:45 - 9:25', period: 2 },
      { timeSlot: '9:30 - 10:10', period: 3 },
      { timeSlot: '10:30 - 11:10', period: 4 },
      { timeSlot: '11:15 - 11:55', period: 5 },
      { timeSlot: '12:00 - 12:40', period: 6 },
      { timeSlot: '1:20 - 2:00', period: 7 },
    ],
    'Friday': [
      { timeSlot: '8:00 - 8:40', period: 1 },
      { timeSlot: '8:45 - 9:25', period: 2 },
      { timeSlot: '9:30 - 10:10', period: 3 },
      { timeSlot: '10:30 - 11:10', period: 4 },
      { timeSlot: '11:15 - 11:55', period: 5 },
      { timeSlot: '12:00 - 12:40', period: 6 },
      { timeSlot: '1:20 - 2:00', period: 7 },
    ],
  };

  // Create subject rotation for different days
  WEEKDAYS.forEach((day, dayIndex) => {
    const daySchedule = scheduleTemplates[day];
    
    daySchedule.forEach((slot, slotIndex) => {
      // Get subjects for Class 10 from our school data
      const class10Subjects = subjectAllocationData.filter(s => s.grade === 'Class 10');
      
      if (class10Subjects.length > 0) {
        // Rotate subjects across days and periods
        const subjectIndex = (dayIndex * 7 + slotIndex) % class10Subjects.length;
        const subject = class10Subjects[subjectIndex];
        
        // Determine room based on subject
        let room = 'Room 101';
        if (subject.subject.toLowerCase().includes('science') || subject.subject.toLowerCase().includes('physics') || subject.subject.toLowerCase().includes('chemistry') || subject.subject.toLowerCase().includes('biology')) {
          room = 'Science Lab';
        } else if (subject.subject.toLowerCase().includes('computer')) {
          room = 'Computer Lab 1';
        } else if (subject.subject.toLowerCase().includes('physical')) {
          room = 'Gymnasium';
        } else if (subject.subject.toLowerCase().includes('math')) {
          room = 'Math Lab';
        }

        timetableData.push({
          day: day,
          timeSlot: slot.timeSlot,
          subject: subject.subject,
          teacher: subject.teacher,
          room: room,
          grade: '10',
          division: 'A',
        });
      }
    });
  });

  return timetableData;
};

const generatedClasses = generateTimetableData();

interface DailyTimetableProps {
  grade?: string;
  division?: string;
}

export function DailyTimetable({ grade = '10', division = 'A' }: DailyTimetableProps) {
  const filteredClasses = generatedClasses.filter(
    (cls) => cls.grade === grade && cls.division === division
  );

  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    return filteredClasses.find(
      (cls) => cls.day === day && cls.timeSlot === timeSlot
    );
  };

  const isBreak = (timeSlot: string) => {
    return timeSlot === '10:10 - 10:30' || timeSlot === '12:40 - 1:20';
  };

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
