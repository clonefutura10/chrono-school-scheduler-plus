
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DailyTimetable } from '@/components/timetable/DailyTimetable';
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
            <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {student.name}. Academic Year {student.academicYear} - {student.term}
            </p>
            <p className="text-sm text-muted-foreground">
              Theme: {academicStructure.theme} • Working Days: {academicStructure.workingDays}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" /> Today's Schedule
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" /> Class {student.grade}-{student.division}
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
            description={`Among ${classInfo.totalStudents} students`}
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
            value={`${student.learningProgress}%`}
            description="Course completion rate"
            icon={<GraduationCap className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Class</span>
                <Badge variant="outline">{student.grade}-{student.division}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Students</span>
                <span className="text-sm">{classInfo.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Class Teacher</span>
                <span className="text-sm">{classInfo.classTeacher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Subjects</span>
                <span className="text-sm">{classInfo.subjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Ideal Class Size</span>
                <span className="text-sm">{currentClass?.idealClassSize}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Academic Year</span>
                <span className="text-sm">{student.academicYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Term</span>
                <Badge variant="outline">{student.term}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Student ID</span>
                <span className="text-sm">{student.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Working Days</span>
                <span className="text-sm">{academicStructure.workingDays}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingEvents.slice(0, 3).map((event, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{event.event}</div>
                    <div className="text-muted-foreground text-xs flex justify-between">
                      <span>{event.date}</span>
                      <Badge className="text-xs" variant="outline">{event.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
