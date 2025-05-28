import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DailyTimetable } from '@/components/timetable/DailyTimetable';
import { TimetableGenerator } from '@/components/timetable/TimetableGenerator';
import { RealtimeTimetableSync } from '@/components/timetable/RealtimeTimetableSync';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar, Award, BookOpen, GraduationCap, Clock, Users, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentProfile } from '@/components/student/StudentProfile';
import { AttendanceChart } from '@/components/student/AttendanceChart';
import { UpcomingAssignments } from '@/components/student/UpcomingAssignments';
import { AcademicTimeline } from '@/components/timeline/AcademicTimeline';
import { Badge } from '@/components/ui/badge';
import { academicStructure, coCurricularEvents, studentStrengthData, subjectAllocationData, teacherLoadData } from '@/data/schoolData';

const Index = () => {
  // Get real data for Class 10-A
  const currentClass = studentStrengthData.find(s => s.grade === 'Class 10');
  const class10Subjects = subjectAllocationData.filter(s => s.grade === 'Class 10');
  
  // Student data based on actual school setup
  const student = {
    name: "John Smith",
    id: "STU10042",
    grade: "10",
    division: "A", 
    attendance: 92,
    ranking: 5,
    completedAssignments: 28,
    totalAssignments: 32,
    academicYear: `${new Date(academicStructure.academicYear.start).getFullYear()}-${new Date(academicStructure.academicYear.end).getFullYear().toString().slice(-2)}`,
    term: academicStructure.terms.find(t => new Date() >= new Date(t.startDate) && new Date() <= new Date(t.endDate))?.name || "Term 2",
    classSize: currentClass?.totalStudents || 68,
    learningProgress: 78
  };

  // Academic progress based on real subjects
  const academicProgress = class10Subjects.map((subject, index) => ({
    subject: subject.subject,
    progress: 75 + (index * 5) % 25, // Varying progress
    teacher: subject.teacher,
    nextTest: `Dec ${15 + index}`
  }));

  const courseCompletion = [
    { category: "Semester Progress", progress: 60, total: 100, description: `${academicStructure.terms[1]?.name} completion` },
    { category: "Required Reading", progress: 75, total: 100, description: "Books completed" },
    { category: "Lab Activities", progress: 88, total: 100, description: "Practical work" },
    { category: "Project Milestones", progress: 45, total: 100, description: "Project completion" }
  ];

  // Use real upcoming events
  const upcomingEvents = coCurricularEvents
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 4);

  const classInfo = {
    totalStudents: student.classSize,
    division: student.division,
    classTeacher: class10Subjects.find(s => s.subject === 'English')?.teacher || "Sarah Johnson",
    subjects: class10Subjects.length
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Chrono School Scheduler Plus</h2>
            <p className="text-muted-foreground">
              AI-Powered Timetable Management System
            </p>
            <RealtimeTimetableSync />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" /> Today's Schedule
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" /> Sync Status
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <TimetableGenerator />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Setup Portal Sync</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                This scheduler automatically syncs with the setup portal to get the latest:
              </div>
              <ul className="text-sm space-y-1">
                <li>• Teacher availability & preferences</li>
                <li>• Class configurations & requirements</li>
                <li>• Subject assignments & schedules</li>
                <li>• Real-time updates & changes</li>
              </ul>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Scheduling Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Conflict Detection</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Load Balancing</span>
                  <Badge variant="outline">Optimized</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Smart Assignment</span>
                  <Badge variant="outline">Groq AI</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto-Sync</span>
                  <Badge variant="outline">Real-time</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="timetable">Smart Timetable</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timetable" className="space-y-4 mt-4">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>AI-Generated Class Timetable</span>
                  <Button variant="outline" size="sm">Download</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DailyTimetable 
                  grade="10" 
                  division="A" 
                />
              </CardContent>
            </Card>
            
            <AcademicTimeline compact={true} />
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-4">
            <UpcomingAssignments />
          </TabsContent>

          <TabsContent value="attendance" className="mt-4">
            <AttendanceChart />
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {academicProgress.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <div className="text-xs text-muted-foreground">
                        Teacher: {subject.teacher} • Next Test: {subject.nextTest}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseCompletion.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm font-medium">{course.category}</span>
                      <div className="text-xs text-muted-foreground">{course.description}</div>
                    </div>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
