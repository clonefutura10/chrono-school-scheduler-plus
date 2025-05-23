
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const getStatusDot = (status?: string) => {
  switch (status) {
    case 'ongoing':
      return <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>;
    case 'completed':
      return <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>;
    case 'upcoming':
      return <span className="h-2 w-2 rounded-full bg-gray-300 mr-2"></span>;
    default:
      return null;
  }
};

interface AcademicTimelineProps {
  compact?: boolean;
}

export function AcademicTimeline({ compact = false }: AcademicTimelineProps) {
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
            <div className="space-y-4">
              {semesterData
                .slice(0, compact ? 5 : semesterData.length)
                .map((item) => (
                <div key={item.id} className="flex items-start space-x-2 p-2 border-b last:border-0">
                  {getStatusDot(item.status)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <div className="mt-1">{getCategoryBadge(item.category)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              {compact && semesterData.length > 5 && (
                <div className="text-center">
                  <Badge variant="outline" className="cursor-pointer">
                    + {semesterData.length - 5} more events
                  </Badge>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="yearly" className="mt-4">
            <div className="space-y-4">
              {yearlyData
                .slice(0, compact ? 5 : yearlyData.length)
                .map((item) => (
                <div key={item.id} className="flex items-start space-x-2 p-2 border-b last:border-0">
                  {getStatusDot(item.status)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <div className="mt-1">{getCategoryBadge(item.category)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              {compact && yearlyData.length > 5 && (
                <div className="text-center">
                  <Badge variant="outline" className="cursor-pointer">
                    + {yearlyData.length - 5} more events
                  </Badge>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
