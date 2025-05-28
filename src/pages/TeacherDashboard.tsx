import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequestForm } from '@/components/requests/RequestForm';
import { RequestsList } from '@/components/requests/RequestsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock, Target } from 'lucide-react';
import { coCurricularEvents } from '@/data/schoolData';
import { supabase } from '@/integrations/supabase/client';

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
}

const TeacherDashboard = () => {
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate dynamic mock teacher data
  const generateMockTeacherProfile = (): TeacherProfile => {
    const names = ["Sarah Johnson", "Michael Chen", "Emily Wilson", "David Brown", "Lisa Anderson"];
    const subjectSets = [
      ["English", "Literature"],
      ["Mathematics", "Statistics"],
      ["Physics", "Chemistry"],
      ["Biology", "Environmental Science"],
      ["History", "Geography"]
    ];
    const gradeSets = [
      ["Class 9", "Class 10"],
      ["Class 10", "Class 11"],
      ["Class 11", "Class 12"],
      ["Class 8", "Class 9"],
      ["Class 6", "Class 7"]
    ];

    const randomIndex = Math.floor(Math.random() * names.length);
    const randomClasses = Math.floor(Math.random() * 10) + 15; // 15-25 classes
    
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const schedule = days.map(day => ({
      day,
      periods: Array.from({length: Math.floor(Math.random() * 3) + 3}, (_, i) => 
        `${Math.floor(Math.random() * 3) + 9}-${String.fromCharCode(65 + Math.floor(Math.random() * 3))} ${subjectSets[randomIndex][0]}`
      )
    }));

    return {
      name: names[randomIndex],
      subjects: subjectSets[randomIndex],
      grades: gradeSets[randomIndex],
      totalClasses: randomClasses,
      maxCapacity: 30,
      schedule
    };
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);

      // Fetch teacher data from Supabase
      const { data: teachersData, error } = await supabase
        .from('teachers')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error fetching teachers:', error);
      }

      let processedTeacherProfile: TeacherProfile;

      if (teachersData && teachersData.length > 0) {
        const teacher = teachersData[0];
        const subjects = Array.isArray(teacher.subjects) 
          ? teacher.subjects as string[]
          : typeof teacher.subjects === 'string'
          ? [teacher.subjects]
          : ["English"];

        // Generate realistic schedule
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const schedule = days.map(day => ({
          day,
          periods: Array.from({length: Math.floor(Math.random() * 3) + 3}, (_, i) => 
            `${Math.floor(Math.random() * 3) + 9}-${String.fromCharCode(65 + i)} ${subjects[0]}`
          )
        }));

        processedTeacherProfile = {
          name: `${teacher.first_name} ${teacher.last_name}`,
          subjects,
          grades: ["Class 9", "Class 10"], // Default grades
          totalClasses: Math.floor(Math.random() * 10) + 15,
          maxCapacity: teacher.max_hours_per_day || 30,
          schedule
        };
      } else {
        // Use dynamic mock data
        processedTeacherProfile = generateMockTeacherProfile();
      }

      setTeacherProfile(processedTeacherProfile);

    } catch (error) {
      console.error('Error fetching teacher data:', error);
      setTeacherProfile(generateMockTeacherProfile());
    } finally {
      setLoading(false);
    }
  };

  if (loading || !teacherProfile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Loading teacher dashboard...</div>
        </div>
      </AppLayout>
    );
  }

  const workloadPercentage = (teacherProfile.totalClasses / teacherProfile.maxCapacity) * 100;
  
  // Generate dynamic student progress data
  const studentProgress = [
    { class: "9-A", totalStudents: Math.floor(Math.random() * 10) + 30, assignments: { submitted: Math.floor(Math.random() * 5) + 28, pending: Math.floor(Math.random() * 5) + 2 }, avgScore: Math.floor(Math.random() * 15) + 75 },
    { class: "9-B", totalStudents: Math.floor(Math.random() * 10) + 30, assignments: { submitted: Math.floor(Math.random() * 5) + 28, pending: Math.floor(Math.random() * 5) + 2 }, avgScore: Math.floor(Math.random() * 15) + 75 },
    { class: "10-A", totalStudents: Math.floor(Math.random() * 10) + 30, assignments: { submitted: Math.floor(Math.random() * 5) + 28, pending: Math.floor(Math.random() * 5) + 2 }, avgScore: Math.floor(Math.random() * 15) + 75 },
    { class: "10-B", totalStudents: Math.floor(Math.random() * 10) + 30, assignments: { submitted: Math.floor(Math.random() * 5) + 28, pending: Math.floor(Math.random() * 5) + 2 }, avgScore: Math.floor(Math.random() * 15) + 75 }
  ];

  const totalStudents = studentProgress.reduce((sum, cls) => sum + cls.totalStudents, 0);
  const avgPerformance = Math.round(studentProgress.reduce((sum, cls) => sum + cls.avgScore, 0) / studentProgress.length);

  const upcomingEvents = coCurricularEvents
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 4)
    .map(event => ({
      event: event.event,
      date: event.date,
      type: event.type
    }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {teacherProfile.name}. Manage your classes and track student progress.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Classes"
            value={`${teacherProfile.totalClasses}`}
            description={`${teacherProfile.maxCapacity - teacherProfile.totalClasses} slots available`}
            icon={<BookOpen className="h-4 w-4" />}
          />
          <StatsCard
            title="Students"
            value={totalStudents.toString()}
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
                    <div className="flex gap-2">
                      {teacherProfile.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Grades</h4>
                    <div className="flex gap-2">
                      {teacherProfile.grades.map((grade, index) => (
                        <Badge key={index} variant="outline">{grade}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Weekly Load</h4>
                    <div className="text-2xl font-bold">{teacherProfile.totalClasses} classes</div>
                    <div className="text-sm text-muted-foreground">
                      {teacherProfile.maxCapacity - teacherProfile.totalClasses} slots available
                    </div>
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
                        <h4 className="font-medium">{classData.class}</h4>
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
