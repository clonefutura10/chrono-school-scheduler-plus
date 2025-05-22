
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimetableCell } from './TimetableCell';

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

// Sample class data
const sampleClasses = [
  {
    day: 'Monday',
    timeSlot: '8:00 - 8:40',
    subject: 'Mathematics',
    teacher: 'Mr. Johnson',
    room: 'Room 101',
    grade: '10',
    division: 'A',
  },
  {
    day: 'Monday',
    timeSlot: '8:45 - 9:25',
    subject: 'Science',
    teacher: 'Ms. Parker',
    room: 'Lab 3',
    grade: '10',
    division: 'A',
  },
  {
    day: 'Monday',
    timeSlot: '10:30 - 11:10',
    subject: 'English',
    teacher: 'Mrs. Williams',
    room: 'Room 105',
    grade: '10',
    division: 'A',
  },
  {
    day: 'Tuesday',
    timeSlot: '8:00 - 8:40',
    subject: 'History',
    teacher: 'Mr. Davis',
    room: 'Room 201',
    grade: '10',
    division: 'A',
  },
  {
    day: 'Wednesday',
    timeSlot: '1:20 - 2:00',
    subject: 'Physical Education',
    teacher: 'Coach Smith',
    room: 'Gymnasium',
    grade: '10',
    division: 'A',
  },
];

interface DailyTimetableProps {
  grade?: string;
  division?: string;
}

export function DailyTimetable({ grade = '10', division = 'A' }: DailyTimetableProps) {
  const filteredClasses = sampleClasses.filter(
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
