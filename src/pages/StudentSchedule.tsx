
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Mock schedule data
const mockScheduleData = [
  {
    day: "Monday",
    schedule: [
      { period: 1, time: "8:00 - 8:45", subject: "Mathematics", teacher: "John Smith", room: "101" },
      { period: 2, time: "8:50 - 9:35", subject: "English", teacher: "Sarah Johnson", room: "102" },
      { period: 3, time: "9:40 - 10:25", subject: "Science", teacher: "Michael Brown", room: "Lab 1" },
      { period: 4, time: "10:30 - 11:15", subject: "History", teacher: "David Wilson", room: "103" },
      { period: 5, time: "11:30 - 12:15", subject: "Computer Science", teacher: "Emily Clark", room: "Lab 2" },
      { period: 6, time: "12:20 - 13:05", subject: "Physical Education", teacher: "Robert Johnson", room: "Gym" },
      { period: 7, time: "13:10 - 13:55", subject: "Art", teacher: "Lisa Chen", room: "Art Room" },
    ]
  },
  {
    day: "Tuesday",
    schedule: [
      { period: 1, time: "8:00 - 8:45", subject: "Physics", teacher: "Michael Brown", room: "Lab 1" },
      { period: 2, time: "8:50 - 9:35", subject: "Mathematics", teacher: "John Smith", room: "101" },
      { period: 3, time: "9:40 - 10:25", subject: "Geography", teacher: "James Wilson", room: "105" },
      { period: 4, time: "10:30 - 11:15", subject: "English", teacher: "Sarah Johnson", room: "102" },
      { period: 5, time: "11:30 - 12:15", subject: "Chemistry", teacher: "Jessica Lee", room: "Lab 3" },
      { period: 6, time: "12:20 - 13:05", subject: "Music", teacher: "Daniel Taylor", room: "Music Room" },
      { period: 7, time: "13:10 - 13:55", subject: "Library", teacher: "Anna Martinez", room: "Library" },
    ]
  },
  {
    day: "Wednesday",
    schedule: [
      { period: 1, time: "8:00 - 8:45", subject: "English", teacher: "Sarah Johnson", room: "102" },
      { period: 2, time: "8:50 - 9:35", subject: "History", teacher: "David Wilson", room: "103" },
      { period: 3, time: "9:40 - 10:25", subject: "Mathematics", teacher: "John Smith", room: "101" },
      { period: 4, time: "10:30 - 11:15", subject: "Biology", teacher: "Karen Williams", room: "Lab 4" },
      { period: 5, time: "11:30 - 12:15", subject: "Computer Science", teacher: "Emily Clark", room: "Lab 2" },
      { period: 6, time: "12:20 - 13:05", subject: "Physical Education", teacher: "Robert Johnson", room: "Gym" },
      { period: 7, time: "13:10 - 13:55", subject: "Study Hall", teacher: "Various", room: "Library" },
    ]
  },
  {
    day: "Thursday",
    schedule: [
      { period: 1, time: "8:00 - 8:45", subject: "Chemistry", teacher: "Jessica Lee", room: "Lab 3" },
      { period: 2, time: "8:50 - 9:35", subject: "Physics", teacher: "Michael Brown", room: "Lab 1" },
      { period: 3, time: "9:40 - 10:25", subject: "Mathematics", teacher: "John Smith", room: "101" },
      { period: 4, time: "10:30 - 11:15", subject: "Geography", teacher: "James Wilson", room: "105" },
      { period: 5, time: "11:30 - 12:15", subject: "English", teacher: "Sarah Johnson", room: "102" },
      { period: 6, time: "12:20 - 13:05", subject: "Art", teacher: "Lisa Chen", room: "Art Room" },
      { period: 7, time: "13:10 - 13:55", subject: "Counseling", teacher: "Michelle Adams", room: "Counseling" },
    ]
  },
  {
    day: "Friday",
    schedule: [
      { period: 1, time: "8:00 - 8:45", subject: "Mathematics", teacher: "John Smith", room: "101" },
      { period: 2, time: "8:50 - 9:35", subject: "English", teacher: "Sarah Johnson", room: "102" },
      { period: 3, time: "9:40 - 10:25", subject: "Biology", teacher: "Karen Williams", room: "Lab 4" },
      { period: 4, time: "10:30 - 11:15", subject: "History", teacher: "David Wilson", room: "103" },
      { period: 5, time: "11:30 - 12:15", subject: "Music", teacher: "Daniel Taylor", room: "Music Room" },
      { period: 6, time: "12:20 - 13:05", subject: "Physical Education", teacher: "Robert Johnson", room: "Gym" },
      { period: 7, time: "13:10 - 13:55", subject: "Club Activities", teacher: "Various", room: "Various" },
    ]
  },
];

const mockUpcomingEvents = [
  { id: 1, title: "Math Quiz", date: "2025-05-25", subject: "Mathematics", type: "quiz" },
  { id: 2, title: "Science Lab Report Due", date: "2025-05-27", subject: "Science", type: "assignment" },
  { id: 3, title: "Field Trip: Museum", date: "2025-06-05", subject: "History", type: "event" },
  { id: 4, title: "English Essay Due", date: "2025-05-29", subject: "English", type: "assignment" },
  { id: 5, title: "Sports Day", date: "2025-06-10", subject: "Physical Education", type: "event" },
];

const getDayFromIndex = (index) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[index];
};

const getEventBadgeColor = (type) => {
  switch(type) {
    case 'quiz': return 'bg-yellow-500';
    case 'assignment': return 'bg-blue-500';
    case 'event': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const StudentSchedule = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  
  const dayName = getDayFromIndex(selectedDate.getDay());
  const daySchedule = mockScheduleData.find(day => day.day === dayName) || 
    { day: dayName, schedule: [] };
  
  const handlePreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };
  
  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };
  
  const handleDownloadSchedule = () => {
    toast.success("Schedule downloaded successfully");
  };

  const handleSetToday = () => {
    setSelectedDate(today);
  };

  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');
  
  const isWeekend = dayName === "Saturday" || dayName === "Sunday";
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Schedule</h2>
            <p className="text-muted-foreground">
              View your daily class schedule and upcoming events.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSetToday}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button variant="outline" onClick={handleDownloadSchedule}>
              <Download className="mr-2 h-4 w-4" />
              Download Schedule
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Daily Schedule</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePreviousDay}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{formattedDate}</span>
              <Button variant="outline" size="icon" onClick={handleNextDay}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isWeekend ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium mb-2">No Classes Scheduled</h3>
                <p className="text-muted-foreground">Enjoy your weekend!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Period</th>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">Subject</th>
                      <th className="py-3 px-4 text-left">Teacher</th>
                      <th className="py-3 px-4 text-left">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daySchedule.schedule.map((period) => (
                      <tr key={period.period} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium">{period.period}</td>
                        <td className="py-4 px-4">{period.time}</td>
                        <td className="py-4 px-4 font-medium">{period.subject}</td>
                        <td className="py-4 px-4">{period.teacher}</td>
                        <td className="py-4 px-4">{period.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex flex-col">
                      <span className="font-medium">{event.title}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={getEventBadgeColor(event.type)} variant="secondary">
                          {event.type}
                        </Badge>
                        <span>{event.subject}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      {format(parseISO(event.date), 'MMM d')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockScheduleData.map((day) => (
                  <div key={day.day} className="border rounded-lg p-3">
                    <div className="font-medium mb-2">{day.day}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {day.schedule.slice(0, 4).map((period) => (
                        <div key={period.period} className="text-sm flex items-center gap-1">
                          <span className="font-medium text-gray-500">{period.period}.</span>
                          <span className="truncate">{period.subject}</span>
                        </div>
                      ))}
                      {day.schedule.length > 4 && (
                        <div className="text-sm text-muted-foreground col-span-2">
                          + {day.schedule.length - 4} more periods
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentSchedule;
