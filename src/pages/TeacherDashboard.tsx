
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequestForm } from '@/components/requests/RequestForm';
import { RequestsList } from '@/components/requests/RequestsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock, Target } from 'lucide-react';

const teacherProfile = {
  name: "Sarah Johnson",
  subjects: ["English"],
  grades: ["Class 9", "Class 10"],
  totalClasses: 22,
  maxCapacity: 30,
  schedule: [
    { day: "Monday", periods: ["9-A English", "9-B English", "10-A English", "10-B English"] },
    { day: "Tuesday", periods: ["9-A English", "10-A English", "10-B English"] },
    { day: "Wednesday", periods: ["9-B English", "10-A English", "10-B English"] },
    { day: "Thursday", periods: ["9-A English", "9-B English", "10-A English"] },
    { day: "Friday", periods: ["9-A English", "9-B English", "10-B English"] }
  ]
};

const upcomingEvents = [
  { event: "English Essay Competition", date: "November 25", type: "competition" },
  { event: "Parent-Teacher Meeting", date: "November 30", type: "meeting" },
  { event: "Mid-term Exam Preparation", date: "December 5", type: "exam" },
  { event: "Literary Club Meeting", date: "December 10", type: "club" }
];

const studentProgress = [
  { class: "9-A", totalStudents: 35, assignments: { submitted: 32, pending: 3 }, avgScore: 78 },
  { class: "9-B", totalStudents: 34, assignments: { submitted: 30, pending: 4 }, avgScore: 82 },
  { class: "10-A", totalStudents: 33, assignments: { submitted: 33, pending: 0 }, avgScore: 85 },
  { class: "10-B", totalStudents: 32, assignments: { submitted: 29, pending: 3 }, avgScore: 80 }
];

const TeacherDashboard = () => {
  const workloadPercentage = (teacherProfile.totalClasses / teacherProfile.maxCapacity) * 100;

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
            value="134"
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
            value="81%"
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
