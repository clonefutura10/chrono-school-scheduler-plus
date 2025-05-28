
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequestForm } from '@/components/requests/RequestForm';
import { RequestsList } from '@/components/requests/RequestsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock, Target } from 'lucide-react';
import { SchoolDataService } from '@/services/schoolDataService';
import type { TeacherWithAssignments } from '@/types/database';

interface TeacherProfile {
  name: string;
  subjects: string[];
  grades: string[];
  totalClasses: number;
  maxCapacity: number;
  schedule: Array<{
    day: string;
    periods: string[];
  }>;
  department: string;
  totalStudents: number;
  assignedClasses: string[];
}

const TeacherDashboard = () => {
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [realDataAvailable, setRealDataAvailable] = useState(false);

  useEffect(() => {
    fetchTeacherData();
    
    // Set up real-time subscriptions
    const unsubscribe = SchoolDataService.setupRealtimeSubscriptions({
      onTeacherChange: () => fetchTeacherData()
    });

    return unsubscribe;
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);

      // Fetch teachers from database
      const teachers = await SchoolDataService.getAllTeachers();
      console.log('Teacher Dashboard - Fetched teachers:', teachers);

      if (teachers.length > 0) {
        setRealDataAvailable(true);
        
        // Use first teacher as demo teacher (in real app, this would be based on logged-in user)
        const teacher = teachers[0];
        
        // Get teacher with assignments
        const teacherWithAssignments = await SchoolDataService.getTeacherById(teacher.id);
        
        if (teacherWithAssignments) {
          const assignments = teacherWithAssignments.teacher_subject_mappings || [];
          
          // Calculate total classes and students
          const totalClasses = assignments.reduce((sum, assignment) => sum + assignment.periods_per_week, 0);
          const totalStudents = assignments.reduce((sum, assignment) => {
            return sum + (assignment.classes?.actual_enrollment || 0);
          }, 0);

          // Extract unique subjects and classes
          const subjects = Array.from(new Set(assignments.map(a => a.subjects?.name).filter(Boolean))) as string[];
          const assignedClasses = Array.from(new Set(assignments.map(a => 
            a.classes ? `${a.classes.grade}-${a.classes.section}` : ''
          ).filter(Boolean)));

          // Generate realistic schedule
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          const schedule = days.map(day => ({
            day,
            periods: assignments.slice(0, Math.floor(Math.random() * 3) + 3).map((assignment, i) => 
              `${Math.floor(Math.random() * 3) + 9}-${assignment.classes?.section || 'A'} ${assignment.subjects?.name || 'Subject'}`
            )
          }));

          const processedTeacherProfile: TeacherProfile = {
            name: `${teacher.first_name} ${teacher.last_name}`,
            subjects: subjects.length > 0 ? subjects : (teacher.subjects as string[] || ["General"]),
            grades: assignedClasses.length > 0 ? assignedClasses : ["Class 9", "Class 10"],
            totalClasses,
            maxCapacity: teacher.max_periods_per_day * 5, // Weekly capacity
            schedule,
            department: teacher.department || "General",
            totalStudents,
            assignedClasses
          };

          setTeacherProfile(processedTeacherProfile);
        }
      } else {
        // Fallback to dynamic mock data
        setRealDataAvailable(false);
        const mockProfile = generateMockTeacherProfile();
        setTeacherProfile(mockProfile);
      }

    } catch (error) {
      console.error('Error fetching teacher data:', error);
      setRealDataAvailable(false);
      const mockProfile = generateMockTeacherProfile();
      setTeacherProfile(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTeacherProfile = (): TeacherProfile => {
    const mockData = SchoolDataService.generateMockTeacherData();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const schedule = days.map(day => ({
      day,
      periods: Array.from({length: Math.floor(Math.random() * 3) + 3}, (_, i) => 
        `${Math.floor(Math.random() * 3) + 9}-${String.fromCharCode(65 + i)} ${mockData.subjects[0]}`
      )
    }));

    return {
      ...mockData,
      grades: ["Class 9", "Class 10"],
      schedule,
      department: "Science",
      totalStudents: Math.floor(Math.random() * 50) + 100,
      assignedClasses: ["9-A", "9-B", "10-A"]
    };
  };

  if (loading || !teacherProfile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">Loading teacher dashboard...</div>
            <div className="text-sm text-muted-foreground">
              {realDataAvailable ? 'Connected to database' : 'Preparing demo data'}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const workloadPercentage = (teacherProfile.totalClasses / teacherProfile.maxCapacity) * 100;
  
  // Generate dynamic student progress data
  const studentProgress = teacherProfile.assignedClasses.map(className => ({
    class: className,
    totalStudents: Math.floor(Math.random() * 10) + 30,
    assignments: { 
      submitted: Math.floor(Math.random() * 5) + 28, 
      pending: Math.floor(Math.random() * 5) + 2 
    },
    avgScore: Math.floor(Math.random() * 15) + 75
  }));

  const avgPerformance = Math.round(studentProgress.reduce((sum, cls) => sum + cls.avgScore, 0) / studentProgress.length);

  // Mock upcoming events
  const upcomingEvents = [
    { event: "Staff Meeting", date: "2025-01-15", type: "Meeting" },
    { event: "Parent Conference", date: "2025-01-20", type: "Conference" },
    { event: "Grade Submission", date: "2025-01-25", type: "Academic" },
    { event: "Department Review", date: "2025-02-01", type: "Review" }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {teacherProfile.name}. Manage your classes and track student progress.
          </p>
          <p className="text-sm text-muted-foreground">
            Department: {teacherProfile.department} • Subjects: {teacherProfile.subjects.join(', ')}
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
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Weekly Classes"
            value={`${teacherProfile.totalClasses}`}
            description={`${teacherProfile.maxCapacity - teacherProfile.totalClasses} slots available`}
            icon={<BookOpen className="h-4 w-4" />}
          />
          <StatsCard
            title="Students"
            value={teacherProfile.totalStudents.toString()}
            description="Across all classes"
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Workload"
            value={`${workloadPercentage.toFixed(0)}%`}
            description="Of total capacity"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatsCard
            title="Avg Performance"
            value={`${avgPerformance}%`}
            description="Class average"
            icon={<Target className="h-4 w-4" />}
          />
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="new-request">New Request</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Subjects</h4>
                    <div className="flex gap-2 flex-wrap">
                      {teacherProfile.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Assigned Classes</h4>
                    <div className="flex gap-2 flex-wrap">
                      {teacherProfile.assignedClasses.map((grade, index) => (
                        <Badge key={index} variant="outline">{grade}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Weekly Load</h4>
                    <div className="text-2xl font-bold">{teacherProfile.totalClasses} periods</div>
                    <div className="text-sm text-muted-foreground">
                      {teacherProfile.maxCapacity - teacherProfile.totalClasses} periods available
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Department</h4>
                    <Badge variant="outline">{teacherProfile.department}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="font-medium text-sm">{event.event}</div>
                          <div className="text-xs text-muted-foreground">{event.date}</div>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress.map((classData, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Class {classData.class}</h4>
                        <Badge variant="outline">{classData.totalStudents} students</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Assignments Submitted:</span>
                          <div className="font-medium">{classData.assignments.submitted}/{classData.totalStudents}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pending:</span>
                          <div className="font-medium">{classData.assignments.pending}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Average Score:</span>
                          <div className="font-medium">{classData.avgScore}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Teaching Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherProfile.schedule.map((day, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{day.day}</h4>
                      <div className="flex flex-wrap gap-2">
                        {day.periods.map((period, periodIndex) => (
                          <Badge key={periodIndex} variant="outline">{period}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4 mt-4">
            <RequestsList />
          </TabsContent>
          
          <TabsContent value="new-request" className="mt-4">
            <RequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TeacherDashboard;
