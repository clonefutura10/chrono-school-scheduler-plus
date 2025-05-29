
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  GraduationCap, 
  Building, 
  BookOpen, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap
} from 'lucide-react';
import { SchoolDataService } from '@/services/schoolDataService';
import { AITimetableGenerator } from '@/components/ai/AITimetableGenerator';
import { AIPerformanceAnalytics } from '@/components/ai/AIPerformanceAnalytics';
import { AIRecommendations } from '@/components/ai/AIRecommendations';
import type { School as SchoolType } from '@/types/database';

// Mock data interfaces for fallback
interface MockSchoolData {
  name: string;
  principal: string;
  academic_year: string;
  total_students: number;
  total_teachers: number;
  total_classrooms: number;
  working_days: number;
  school_vision: string;
}

const AdminDashboard = () => {
  const [schoolData, setSchoolData] = useState<SchoolType | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classroomCount, setClassroomCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [realDataAvailable, setRealDataAvailable] = useState(false);

  useEffect(() => {
    fetchRealSchoolData();
    
    // Set up real-time subscriptions
    const unsubscribe = SchoolDataService.setupRealtimeSubscriptions({
      onStudentChange: () => fetchRealSchoolData(),
      onTeacherChange: () => fetchRealSchoolData(),
      onSchoolChange: () => fetchRealSchoolData()
    });

    return unsubscribe;
  }, []);

  const fetchRealSchoolData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        school,
        students,
        teachers,
        classrooms
      ] = await Promise.all([
        SchoolDataService.getSchoolInfo(),
        SchoolDataService.getStudentCount(),
        SchoolDataService.getTeacherCount(),
        SchoolDataService.getClassroomCount()
      ]);

      console.log('Admin Dashboard - Fetched data:', { school, students, teachers, classrooms });

      if (school && (students > 0 || teachers > 0)) {
        setRealDataAvailable(true);
        setSchoolData(school);
        setStudentCount(students);
        setTeacherCount(teachers);
        setClassroomCount(classrooms);
      } else {
        // Fallback to dynamic mock data
        console.log('Using mock data as fallback');
        setRealDataAvailable(false);
        generateFallbackData();
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setRealDataAvailable(false);
      generateFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackData = () => {
    const mockData: MockSchoolData = {
      name: "Demo International School",
      principal: "Dr. Sarah Anderson",
      academic_year: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
      total_students: Math.floor(Math.random() * 500) + 800,
      total_teachers: Math.floor(Math.random() * 20) + 40,
      total_classrooms: Math.floor(Math.random() * 10) + 30,
      working_days: 220,
      school_vision: "Excellence in Education & Innovation"
    };

    setSchoolData({
      name: mockData.name,
      principal_name: mockData.principal,
      academic_year: mockData.academic_year,
      school_vision: mockData.school_vision,
      working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      number_of_terms: 3
    } as SchoolType);

    setStudentCount(mockData.total_students);
    setTeacherCount(mockData.total_teachers);
    setClassroomCount(mockData.total_classrooms);
  };

  if (loading || !schoolData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">Loading admin dashboard...</div>
            <div className="text-sm text-muted-foreground">
              {realDataAvailable ? 'Connected to database' : 'Preparing demo data'}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Generate dynamic performance metrics
  const totalCapacity = classroomCount * 30; // Assuming 30 students per classroom
  const utilizationRate = totalCapacity > 0 ? Math.round((studentCount / totalCapacity) * 100) : 0;
  const teacherStudentRatio = teacherCount > 0 ? Math.round(studentCount / teacherCount) : 0;

  // Mock dynamic data that changes on refresh
  const performanceMetrics = [
    {
      title: "Academic Performance",
      value: `${Math.floor(Math.random() * 10) + 85}%`,
      change: Math.floor(Math.random() * 6) + 2,
      trend: "up"
    },
    {
      title: "Attendance Rate",
      value: `${Math.floor(Math.random() * 8) + 92}%`,
      change: Math.floor(Math.random() * 4) + 1,
      trend: "up"
    },
    {
      title: "Resource Utilization",
      value: `${utilizationRate}%`,
      change: Math.floor(Math.random() * 6) - 3,
      trend: utilizationRate > 85 ? "down" : "up"
    }
  ];

  const recentActivities = [
    `${Math.floor(Math.random() * 5) + 15} new student enrollments this week`,
    `${Math.floor(Math.random() * 3) + 2} teachers completed professional development`,
    `${Math.floor(Math.random() * 8) + 12} parent-teacher conferences scheduled`,
    `${Math.floor(Math.random() * 4) + 6} infrastructure maintenance tasks completed`
  ];

  const upcomingEvents = [
    { event: "Academic Review Meeting", date: "2025-01-15", type: "Academic" },
    { event: "Staff Development Workshop", date: "2025-01-18", type: "Training" },
    { event: "Parent Council Meeting", date: "2025-01-22", type: "Community" },
    { event: "Infrastructure Inspection", date: "2025-01-25", type: "Maintenance" }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI-Powered Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to {schoolData.name} - Academic Year {schoolData.academic_year}
          </p>
          <p className="text-sm text-muted-foreground">
            Principal: {schoolData.principal_name} • Vision: {schoolData.school_vision} • Working Days: {schoolData.working_days?.length || 5}/week
          </p>
          <div className="flex gap-2 mt-2">
            {realDataAvailable && (
              <Badge className="bg-green-100 text-green-800">
                ✅ Live Database Connected
              </Badge>
            )}
            {!realDataAvailable && (
              <Badge className="bg-blue-100 text-blue-800">
                🔄 Demo Mode - Data refreshes on reload
              </Badge>
            )}
            <Badge className="bg-purple-100 text-purple-800">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered Analytics
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value={studentCount.toString()}
            description={`Across ${classroomCount} classrooms`}
            icon={<Users className="h-4 w-4" />}
            trending="up"
            trendValue={`${Math.floor(Math.random() * 20) + 10} new this month`}
          />
          <StatsCard
            title="Total Teachers"
            value={teacherCount.toString()}
            description={`${teacherStudentRatio}:1 student ratio`}
            icon={<GraduationCap className="h-4 w-4" />}
          />
          <StatsCard
            title="Classrooms"
            value={classroomCount.toString()}
            description={`${utilizationRate}% utilization`}
            icon={<Building className="h-4 w-4" />}
          />
          <StatsCard
            title="Academic Terms"
            value={schoolData.number_of_terms?.toString() || "3"}
            description="Current academic year"
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {performanceMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`text-xs flex items-center ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`mr-1 h-3 w-3 ${
                    metric.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-[800px] grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-timetable">
              <Brain className="h-4 w-4 mr-1" />
              AI Timetable
            </TabsTrigger>
            <TabsTrigger value="ai-analytics">
              <Zap className="h-4 w-4 mr-1" />
              AI Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations">
              <TrendingUp className="h-4 w-4 mr-1" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>School Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">School Name</span>
                    <span className="text-sm">{schoolData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Principal</span>
                    <span className="text-sm">{schoolData.principal_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Academic Year</span>
                    <Badge variant="outline">{schoolData.academic_year}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Terms</span>
                    <span className="text-sm">{schoolData.number_of_terms} per year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Working Days</span>
                    <span className="text-sm">{schoolData.working_days?.length || 5} days/week</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
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
          </TabsContent>

          <TabsContent value="ai-timetable" className="space-y-4 mt-4">
            <AITimetableGenerator />
          </TabsContent>

          <TabsContent value="ai-analytics" className="space-y-4 mt-4">
            <AIPerformanceAnalytics />
          </TabsContent>

          <TabsContent value="ai-recommendations" className="space-y-4 mt-4">
            <AIRecommendations />
          </TabsContent>

          <TabsContent value="management" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Button className="h-24 flex flex-col">
                <Users className="h-6 w-6 mb-2" />
                Manage Students
              </Button>
              <Button className="h-24 flex flex-col" variant="outline">
                <GraduationCap className="h-6 w-6 mb-2" />
                Manage Teachers
              </Button>
              <Button className="h-24 flex flex-col" variant="outline">
                <Building className="h-6 w-6 mb-2" />
                Manage Infrastructure
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
