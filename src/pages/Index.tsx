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
import { SchoolDataService } from '@/services/schoolDataService';
import type { School, StudentWithClass } from '@/types/database';

const Index = () => {
  const [schoolData, setSchoolData] = useState<School | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [realDataAvailable, setRealDataAvailable] = useState(false);

  useEffect(() => {
    fetchRealSchoolData();
    
    // Set up real-time subscriptions
    const unsubscribe = SchoolDataService.setupRealtimeSubscriptions({
      onStudentChange: (payload) => {
        console.log('Student data changed:', payload);
        fetchRealSchoolData(); // Refresh data when changes occur
      },
      onSchoolChange: (payload) => {
        console.log('School data changed:', payload);
        fetchRealSchoolData();
      }
    });

    return unsubscribe;
  }, []);

  const fetchRealSchoolData = async () => {
    try {
      setLoading(true);

      // Fetch school information
      const school = await SchoolDataService.getSchoolInfo();
      console.log('Fetched school data:', school);

      // Fetch first student for demo (in real app, this would be based on logged-in user)
      const students = await SchoolDataService.getAllStudents();
      console.log('Fetched students:', students);

      // Fetch classes for context
      const classes = await SchoolDataService.getAllClasses();
      console.log('Fetched classes:', classes);

      if (school && students.length > 0) {
        setRealDataAvailable(true);
        setSchoolData(school);

        // Use first student as demo student
        const demoStudent = students[0];
        const studentClass = classes.find(c => c.id === demoStudent.assigned_class_id);

        const processedStudentData = {
          name: `${demoStudent.first_name} ${demoStudent.last_name}`,
          id: demoStudent.student_id,
          grade: demoStudent.grade || "10",
          division: demoStudent.section || "A",
          attendance: Math.floor(Math.random() * 15) + 85, // Mock attendance for now
          ranking: Math.floor(Math.random() * 10) + 1,
          completedAssignments: Math.floor(Math.random() * 5) + 25,
          totalAssignments: Math.floor(Math.random() * 8) + 30,
          academicYear: school.academic_year || `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
          term: "Term 2", // Will be calculated from academic calendar later
          classSize: studentClass?.actual_enrollment || Math.floor(Math.random() * 20) + 30,
          learningProgress: Math.floor(Math.random() * 25) + 70
        };

        const processedClassData = {
          totalStudents: studentClass?.actual_enrollment || 35,
          division: demoStudent.section || "A",
          classTeacher: studentClass?.teachers ? `${studentClass.teachers.first_name} ${studentClass.teachers.last_name}` : "TBD",
          subjects: 9, // Will fetch from subjects table later
          className: studentClass?.name || `Class ${demoStudent.grade}-${demoStudent.section}`
        };

        setStudentData(processedStudentData);
        setClassData(processedClassData);
      } else {
        // Fallback to dynamic mock data
        console.log('Using mock data as fallback');
        setRealDataAvailable(false);
        generateFallbackData();
      }

    } catch (error) {
      console.error('Error fetching school data:', error);
      setRealDataAvailable(false);
      generateFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackData = () => {
    // Generate dynamic mock data that changes on refresh
    const mockStudentData = SchoolDataService.generateMockStudentData();
    
    const mockSchoolData = {
      name: "Demo High School",
      academic_year: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
      school_vision: "Innovation & Excellence in Education",
      working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      number_of_terms: 3
    };

    setStudentData({
      ...mockStudentData,
      academicYear: mockSchoolData.academic_year,
      term: "Term 2"
    });

    setClassData({
      totalStudents: mockStudentData.classSize,
      division: mockStudentData.division,
      classTeacher: "Sarah Johnson",
      subjects: 9
    });

    setSchoolData(mockSchoolData as School);
  };

  if (loading || !studentData || !classData || !schoolData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">Loading school data...</div>
            <div className="text-sm text-muted-foreground">
              {realDataAvailable ? 'Connected to database' : 'Preparing demo data'}
            </div>
          </div>
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

  // Mock upcoming events for now
  const upcomingEvents = [
    { event: "Science Fair", date: "2025-01-15", type: "Academic" },
    { event: "Sports Day", date: "2025-01-20", type: "Sports" },
    { event: "Parent Meeting", date: "2025-01-25", type: "Meeting" },
    { event: "Cultural Program", date: "2025-02-01", type: "Cultural" }
  ];

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
              {schoolData.name} • Vision: {schoolData.school_vision || 'Excellence in Education'} • Working Days: {schoolData.working_days?.length || 5}
            </p>
            {realDataAvailable && (
              <Badge className="mt-1 bg-green-100 text-green-800">
                ✅ Live Database Connected
              </Badge>
            )}
            {!realDataAvailable && (
              <Badge className="mt-1 bg-blue-100 text-blue-800">
                🔄 Demo Mode - Data refreshes on reload
              </Badge>
            )}
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
                <span className="text-sm font-medium">School</span>
                <span className="text-sm">{schoolData.name}</span>
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
                <span className="text-sm">{schoolData.working_days?.length || 5}/week</span>
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
