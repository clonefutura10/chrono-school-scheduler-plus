
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DailyTimetable } from '@/components/timetable/DailyTimetable';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar, Award, BookOpen, GraduationCap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentProfile } from '@/components/student/StudentProfile';
import { AttendanceChart } from '@/components/student/AttendanceChart';
import { UpcomingAssignments } from '@/components/student/UpcomingAssignments';

const Index = () => {
  // Mock data for the student
  const student = {
    name: "John Smith",
    id: "STU10042",
    grade: "10",
    division: "A",
    attendance: 92,
    ranking: 5,
    completedAssignments: 28,
    totalAssignments: 32
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {student.name}. Here's your academic progress.
            </p>
          </div>
          <div>
            <Button>
              <Clock className="mr-2 h-4 w-4" /> Today's Schedule
            </Button>
          </div>
        </div>

        <StudentProfile student={student} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Attendance"
            value={`${student.attendance}%`}
            description="Overall attendance rate"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatsCard
            title="Class Ranking"
            value={`#${student.ranking}`}
            description="Among 35 students"
            icon={<Award className="h-4 w-4" />}
          />
          <StatsCard
            title="Assignments"
            value={`${student.completedAssignments}/${student.totalAssignments}`}
            description="Completed assignments"
            icon={<BookOpen className="h-4 w-4" />}
            trending="up"
            trendValue="3 submitted recently"
          />
          <StatsCard
            title="Learning Progress"
            value="78%"
            description="Course completion rate"
            icon={<GraduationCap className="h-4 w-4" />}
          />
        </div>

        <Separator />

        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="timetable">My Timetable</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timetable" className="space-y-4 mt-4">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Class {student.grade}-{student.division} Timetable</span>
                  <Button variant="outline" size="sm">Download</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DailyTimetable 
                  grade={student.grade} 
                  division={student.division} 
                />
              </CardContent>
            </Card>
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
              <CardTitle>Academic Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Mathematics</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Science</span>
                  <span className="text-sm text-muted-foreground">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">English</span>
                  <span className="text-sm text-muted-foreground">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">History</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Semester Progress</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Required Reading</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Lab Activities</span>
                  <span className="text-sm text-muted-foreground">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Project Milestones</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
