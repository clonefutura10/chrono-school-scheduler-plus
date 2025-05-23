
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  category: string;
  status?: "upcoming" | "ongoing" | "completed";
}

// Mock data for the semester timeline
const semesterData: TimelineEvent[] = [
  { id: 1, title: "Term 1 Classes Begin", date: "2025-06-01", category: "academic", status: "completed" },
  { id: 2, title: "First Unit Test", date: "2025-07-15", category: "exam", status: "completed" },
  { id: 3, title: "Mid-Term Exams", date: "2025-08-20", category: "exam", status: "completed" },
  { id: 4, title: "Term 1 Ends", date: "2025-10-15", category: "academic", status: "completed" },
  { id: 5, title: "Term 2 Classes Begin", date: "2025-11-01", category: "academic", status: "ongoing" },
  { id: 6, title: "Second Unit Test", date: "2025-12-10", category: "exam", status: "upcoming" },
  { id: 7, title: "Annual Sports Day", date: "2025-12-15", category: "event", status: "upcoming" },
  { id: 8, title: "Winter Break", date: "2025-12-24", category: "holiday", status: "upcoming" },
  { id: 9, title: "Classes Resume", date: "2026-01-06", category: "academic", status: "upcoming" },
  { id: 10, title: "Final Exams", date: "2026-03-01", category: "exam", status: "upcoming" },
  { id: 11, title: "Result Declaration", date: "2026-03-31", category: "academic", status: "upcoming" },
];

// Mock data for the yearly timeline
const yearlyData: TimelineEvent[] = [
  { id: 1, title: "Academic Year Begins", date: "2025-06-01", category: "academic", status: "completed" },
  { id: 2, title: "Independence Day Celebration", date: "2025-08-15", category: "event", status: "completed" },
  { id: 3, title: "Teachers' Day", date: "2025-09-05", category: "event", status: "completed" },
  { id: 4, title: "Diwali Break", date: "2025-11-01", category: "holiday", status: "ongoing" },
  { id: 5, title: "Annual Day Celebration", date: "2025-12-20", category: "event", status: "upcoming" },
  { id: 6, title: "Science Exhibition", date: "2026-01-15", category: "event", status: "upcoming" },
  { id: 7, title: "Sports Week", date: "2026-02-10", category: "event", status: "upcoming" },
  { id: 8, title: "Final Assessments", date: "2026-03-01", category: "exam", status: "upcoming" },
  { id: 9, title: "Academic Year Ends", date: "2026-03-31", category: "academic", status: "upcoming" },
  { id: 10, title: "Summer Vacation Begins", date: "2026-04-15", category: "holiday", status: "upcoming" },
];

const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'academic':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Academic</Badge>;
    case 'exam':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Exam</Badge>;
    case 'event':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Event</Badge>;
    case 'holiday':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Holiday</Badge>;
    default:
      return <Badge>Other</Badge>;
  }
};

interface AcademicTimelineProps {
  compact?: boolean;
}

export function AcademicTimeline({ compact = false }: AcademicTimelineProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2025-11-15"));
  
  // Function to group events by date
  const groupEventsByDate = (events: TimelineEvent[]) => {
    const grouped: Record<string, TimelineEvent[]> = {};
    
    events.forEach(event => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    
    return grouped;
  };
  
  const semesterEventsByDate = groupEventsByDate(semesterData);
  const yearlyEventsByDate = groupEventsByDate(yearlyData);
  
  // Function to get dates with events
  const getHighlightedDates = (events: Record<string, TimelineEvent[]>) => {
    return Object.keys(events).map(dateStr => new Date(dateStr));
  };
  
  // Custom Day Content for the Calendar
  const renderDay = (day: Date, events: Record<string, TimelineEvent[]>) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const dayEvents = events[dateString] || [];
    
    return (
      <div className="relative w-full h-full">
        <div>{format(day, 'd')}</div>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="flex gap-0.5">
              {dayEvents.map((event, index) => {
                let dotColor = 'bg-gray-400';
                if (event.category === 'academic') dotColor = 'bg-blue-500';
                if (event.category === 'exam') dotColor = 'bg-red-500';
                if (event.category === 'event') dotColor = 'bg-green-500';
                if (event.category === 'holiday') dotColor = 'bg-purple-500';
                
                return (
                  <div 
                    key={index} 
                    className={`w-1 h-1 rounded-full ${dotColor}`}
                    style={{ display: index < 3 ? 'block' : 'none' }}
                  />
                );
              })}
              {dayEvents.length > 3 && (
                <div className="w-1 h-1 rounded-full bg-gray-500" />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Get events for selected date
  const getEventsForDate = (date: Date | undefined, events: Record<string, TimelineEvent[]>) => {
    if (!date) return [];
    const dateString = format(date, 'yyyy-MM-dd');
    return events[dateString] || [];
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="semester">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="semester">Semester View</TabsTrigger>
            <TabsTrigger value="yearly">Yearly View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="semester" className="mt-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="border rounded-md p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    highlighted: getHighlightedDates(semesterEventsByDate),
                  }}
                  modifiersStyles={{
                    highlighted: {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    }
                  }}
                />
              </div>
              
              <div className="flex-1">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                  </h3>
                  
                  <div className="space-y-4">
                    {getEventsForDate(selectedDate, semesterEventsByDate).map((event) => (
                      <div key={event.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          {getCategoryBadge(event.category)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Status: {event.status}
                        </p>
                      </div>
                    ))}
                    
                    {getEventsForDate(selectedDate, semesterEventsByDate).length === 0 && (
                      <p className="text-muted-foreground">No events scheduled for this date.</p>
                    )}
                  </div>
                </div>
                
                {!compact && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800">Academic Event</Badge>
                    <Badge className="bg-red-100 text-red-800">Exam</Badge>
                    <Badge className="bg-green-100 text-green-800">School Event</Badge>
                    <Badge className="bg-purple-100 text-purple-800">Holiday</Badge>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="yearly" className="mt-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="border rounded-md p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    highlighted: getHighlightedDates(yearlyEventsByDate),
                  }}
                  modifiersStyles={{
                    highlighted: {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    }
                  }}
                />
              </div>
              
              <div className="flex-1">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                  </h3>
                  
                  <div className="space-y-4">
                    {getEventsForDate(selectedDate, yearlyEventsByDate).map((event) => (
                      <div key={event.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          {getCategoryBadge(event.category)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Status: {event.status}
                        </p>
                      </div>
                    ))}
                    
                    {getEventsForDate(selectedDate, yearlyEventsByDate).length === 0 && (
                      <p className="text-muted-foreground">No events scheduled for this date.</p>
                    )}
                  </div>
                </div>
                
                {!compact && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800">Academic Event</Badge>
                    <Badge className="bg-red-100 text-red-800">Exam</Badge>
                    <Badge className="bg-green-100 text-green-800">School Event</Badge>
                    <Badge className="bg-purple-100 text-purple-800">Holiday</Badge>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
