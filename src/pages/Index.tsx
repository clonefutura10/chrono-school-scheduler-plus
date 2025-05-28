import React, { useState, useEffect } from 'react';
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
import { academicStructure, coCurricularEvents } from '@/data/schoolData';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [studentData, setStudentData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate dynamic mock data that changes on refresh
  const generateDynamicStudentData = () => {
    const names = ["John Smith", "Emma Wilson", "Michael Brown", "Sophia Davis", "Ryan Johnson"];
    const grades = ["9", "10", "11"];
    const divisions = ["A", "B", "C"];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    const randomDivision = divisions[Math.floor(Math.random() * divisions.length)];
    const randomAttendance = Math.floor(Math.random() * 15) + 85; // 85-100%
    const randomRanking = Math.floor(Math.random() * 10) + 1; // 1-10
    const randomCompleted = Math.floor(Math.random() * 5) + 25; // 25-30
    const randomTotal = randomCompleted + Math.floor(Math.random() * 5) + 2; // Total assignments
    
    return {
      name: randomName,
      id: `STU${randomGrade}0${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
      grade: randomGrade,
      division: randomDivision,
      attendance: randomAttendance,
      ranking: randomRanking,
      completedAssignments: randomCompleted,
      totalAssignments: randomTotal,
      academicYear: `${new Date(academicStructure.academicYear.start).getFullYear()}-${new Date(academicStructure.academicYear.end).getFullYear().toString().slice(-2)}`,
      term: academicStructure.terms.find(t => new Date() >= new Date(t.startDate) && new Date() <= new Date(t.endDate))?.name || "Term 2",
      classSize: Math.floor(Math.random() * 20) + 30, // 30-50 students
      learningProgress: Math.floor(Math.random() * 25) + 70 // 70-95%
    };
  };

  useEffect(() => {
    fetchStudentDataFromSupabase();
  }, []);

  const fetchStudentDataFromSupabase = async () => {
    try {
      setLoading(true);

      // Try to fetch real student data
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .limit(1);

      // Try to fetch class data
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select(`
          *,
          teachers(first_name, last_name)
        `)
        .limit(1);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      }

      if (classesError) {
        console.error('Error fetching classes:', classesError);
      }

      // Use real data if available, otherwise use dynamic mock data
      let processedStudentData;
      let processedClassData;

      if (studentsData && studentsData.length > 0) {
        const student = studentsData[0];
        processedStudentData = {
          name: `${student.first_name} ${student.last_name}`,
          id: student.student_id,
          grade: student.grade?.replace('Class ', '') || "10",
          division: student.section || "A",
          attendance: Math.floor(Math.random() * 15) + 85,
          ranking: Math.floor(Math.random() * 10) + 1,
          completedAssignments: Math.floor(Math.random() * 5) + 25,
          totalAssignments: Math.floor(Math.random() * 8) + 30,
          academicYear: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
          term: "Term 2",
          classSize: Math.floor(Math.random() * 20) + 30,
          learningProgress: Math.floor(Math.random() * 25) + 70
        };
      } else {
        processedStudentData = generateDynamicStudentData();
      }

      if (classesData && classesData.length > 0) {
        const classInfo = classesData[0];
        processedClassData = {
          totalStudents: classInfo.capacity || processedStudentData.classSize,
          division: processedStudentData.division,
          classTeacher: classInfo.teachers ? `${classInfo.teachers.first_name} ${classInfo.teachers.last_name}` : "Sarah Johnson",
          subjects: Math.floor(Math.random() * 3) + 8 // 8-10 subjects
        };
      } else {
        processedClassData = {
          totalStudents: processedStudentData.classSize,
          division: processedStudentData.division,
          classTeacher: "Sarah Johnson",
          subjects: 9
        };
      }

      setStudentData(processedStudentData);
      setClassData(processedClassData);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to dynamic mock data
      const mockStudent = generateDynamicStudentData();
      setStudentData(mockStudent);
      setClassData({
        totalStudents: mockStudent.classSize,
        division: mockStudent.division,
        classTeacher: "Sarah Johnson",
        subjects: 9
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !studentData || !classData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Loading student dashboard...</div>
        </div>
      </AppLayout>
    );
  }

  // Generate dynamic academic progress
  const subjects = ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History", "Geography"];
  const teachers = ["Prof. Smith", "Ms. Johnson", "Dr. Wilson", "Mr. Brown", "Mrs. Davis"];
  
  const academicProgress = subjects.slice(0, 5).map((subject, index) => ({
    subject,
    progress: Math.floor(Math.random() * 30) + 65, // 65-95%
    teacher: teachers[index % teachers.length],
    nextTest: `Dec ${15 + index}`
  }));

  const courseCompletion = [
    { category: "Semester Progress", progress: Math.floor(Math.random() * 20) + 55, total: 100, description: "Term 2 completion" },
    { category: "Required Reading", progress: Math.floor(Math.random() * 25) + 70, total: 100, description: "Books completed" },
    { category: "Lab Activities", progress: Math.floor(Math.random() * 15) + 80, total: 100, description: "Practical work" },
    { category: "Project Milestones", progress: Math.floor(Math.random() * 30) + 40, total: 100, description: "Project completion" }
  ];

  const upcomingEvents = coCurricularEvents
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 4);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {studentData.name}. Academic Year {studentData.academicYear} - {studentData.term}
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
              <Users className="mr-2 h-4 w-4" /> Class {studentData.grade}-{studentData.division}
            </Button>
          </div>
        </div>

        <StudentProfile student={studentData} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Attendance"
            value={`${studentData.attendance}%`}
            description="Overall attendance rate"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatsCard
            title="Class Ranking"
            value={`#${studentData.ranking}`}
            description={`Among ${classData.totalStudents} students`}
            icon={<Award className="h-4 w-4" />}
          />
          <StatsCard
            title="Assignments"
            value={`${studentData.completedAssignments}/${studentData.totalAssignments}`}
            description="Completed assignments"
            icon={<BookOpen className="h-4 w-4" />}
            trending="up"
            trendValue="3 submitted recently"
          />
          <StatsCard
            title="Learning Progress"
            value={`${studentData.learningProgress}%`}
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
                <Badge variant="outline">{studentData.grade}-{studentData.division}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Students</span>
                <span className="text-sm">{classData.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Class Teacher</span>
                <span className="text-sm">{classData.classTeacher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Subjects</span>
                <span className="text-sm">{classData.subjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Ideal Class Size</span>
                <span className="text-sm">{classData.totalStudents}</span>
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
                <span className="text-sm">{studentData.academicYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Term</span>
                <Badge variant="outline">{studentData.term}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Student ID</span>
                <span className="text-sm">{studentData.id}</span>
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
                  <span>Class {studentData.grade}-{studentData.division} Timetable</span>
                  <Button variant="outline" size="sm">Download</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DailyTimetable 
                  grade={studentData.grade} 
                  division={studentData.division} 
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
