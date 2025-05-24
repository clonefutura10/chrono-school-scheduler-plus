
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { academicStructure, coCurricularEvents } from '@/data/schoolData';

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  category: string;
  status?: "upcoming" | "ongoing" | "completed";
}

// Convert academic structure and events to timeline format
const semesterData: TimelineEvent[] = [
  { id: 1, title: "Term 1 Classes Begin", date: "2025-06-01", category: "academic", status: "completed" },
  ...academicStructure.examinations.map((exam, index) => ({
    id: index + 2,
    title: exam.type,
    date: exam.startDate,
    category: "exam",
    status: new Date(exam.startDate) < new Date() ? "completed" as const : "upcoming" as const
  })),
  { id: 10, title: "Term 1 Ends", date: "2025-10-15", category: "academic", status: "completed" },
  { id: 11, title: "Term 2 Classes Begin", date: "2025-11-01", category: "academic", status: "ongoing" },
  { id: 12, title: "Final Exams", date: "2026-03-01", category: "exam", status: "upcoming" },
  { id: 13, title: "Result Declaration", date: "2026-03-31", category: "academic", status: "upcoming" },
];

// Convert co-curricular events to timeline format
const yearlyData: TimelineEvent[] = [
  { id: 1, title: "Academic Year Begins", date: "2025-06-01", category: "academic", status: "completed" },
  ...coCurricularEvents.map((event, index) => ({
    id: index + 2,
    title: event.event,
    date: event.date,
    category: event.type,
    status: new Date(event.date) < new Date() ? "completed" as const : 
           new Date(event.date).getTime() === new Date().getTime() ? "ongoing" as const : "upcoming" as const
  })),
  { id: 20, title: "Academic Year Ends", date: "2026-03-31", category: "academic", status: "upcoming" },
  { id: 21, title: "Summer Vacation Begins", date: "2026-04-15", category: "holiday", status: "upcoming" },
];

const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'academic':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Academic</Badge>;
    case 'exam':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Exam</Badge>;
    case 'celebration':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Celebration</Badge>;
    case 'competition':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Competition</Badge>;
    case 'sports':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Sports</Badge>;
    case 'holiday':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Holiday</Badge>;
    case 'exhibition':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Exhibition</Badge>;
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
  
  // Get events for selected date
  const getEventsForDate = (date: Date | undefined, events: Record<string, TimelineEvent[]>) => {
    if (!date) return [];
    const dateString = format(date, 'yyyy-MM-dd');
    return events[dateString] || [];
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Timeline - {academicStructure.theme}</CardTitle>
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
                    <Badge className="bg-green-100 text-green-800">Competition</Badge>
                    <Badge className="bg-purple-100 text-purple-800">Celebration</Badge>
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
