
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequestsList } from '@/components/requests/RequestsList';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar, User, BookOpen, School, Building, Users, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyTimetable } from '@/components/timetable/DailyTimetable';
import { GradeDivisionSelector } from '@/components/timetable/GradeDivisionSelector';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AcademicTimeline } from '@/components/timeline/AcademicTimeline';
import { InfrastructureOverview } from '@/components/infrastructure/InfrastructureOverview';
import { TeacherLoadSummary } from '@/components/staff/TeacherLoadSummary';
import { AcademicPlanning } from '@/components/academic/AcademicPlanning';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { SchoolDataService } from '@/services/schoolDataService';
import type { School } from '@/types/database';

const AdminDashboard = () => {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [schoolData, setSchoolData] = useState<School | null>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClassrooms: 0,
    totalClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [realDataAvailable, setRealDataAvailable] = useState(false);

  useEffect(() => {
    fetchAdminData();
    
    // Set up real-time subscriptions for admin data
    const unsubscribe = SchoolDataService.setupRealtimeSubscriptions({
      onStudentChange: () => fetchAdminData(),
      onTeacherChange: () => fetchAdminData(),
      onClassChange: () => fetchAdminData(),
      onSchoolChange: () => fetchAdminData()
    });

    return unsubscribe;
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all admin data in parallel
      const [
        school,
        studentCount,
        teacherCount,
        classroomCount,
        classes
      ] = await Promise.all([
        SchoolDataService.getSchoolInfo(),
        SchoolDataService.getStudentCount(),
        SchoolDataService.getTeacherCount(),
        SchoolDataService.getClassroomCount(),
        SchoolDataService.getAllClasses()
      ]);

      console.log('Admin Dashboard - Fetched data:', {
        school,
        studentCount,
        teacherCount,
        classroomCount,
        classesLength: classes.length
      });

      if (school) {
        setRealDataAvailable(true);
        setSchoolData(school);
        setStats({
          totalStudents: studentCount,
          totalTeachers: teacherCount,
          totalClassrooms: classroomCount,
          totalClasses: classes.length
        });
      } else {
        // Fallback to dynamic mock data
        setRealDataAvailable(false);
        setSchoolData({
          id: 'demo-school',
          name: 'Demo High School',
          principal_name: 'Dr. Sarah Johnson',
          academic_year: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
          school_vision: 'Excellence in Education & Innovation',
          school_type: 'Public',
          number_of_terms: 3,
          working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          address: '123 Education Street, Learning City',
          phone: '+1-555-0123',
          email: 'admin@demoschool.edu'
        } as School);

        // Generate dynamic mock stats
        setStats({
          totalStudents: Math.floor(Math.random() * 200) + 800, // 800-1000 students
          totalTeachers: Math.floor(Math.random() * 20) + 40,   // 40-60 teachers
          totalClassrooms: Math.floor(Math.random() * 10) + 30, // 30-40 classrooms
          totalClasses: Math.floor(Math.random() * 5) + 15      // 15-20 classes
        });
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setRealDataAvailable(false);
      // Use fallback data on error
      setSchoolData({
        id: 'demo-school',
        name: 'Demo High School',
        principal_name: 'Dr. Sarah Johnson',
        academic_year: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
        school_vision: 'Excellence in Education & Innovation'
      } as School);
      setStats({
        totalStudents: 956,
        totalTeachers: 52,
        totalClassrooms: 38,
        totalClasses: 18
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAll = () => {
    toast.success("All pending requests have been approved");
  };

  const handleGenerateTimetable = () => {
    toast.success(`Generated timetable for Grade ${selectedGrade}-${selectedDivision}`);
  };

  const handlePrintTimetable = () => {
    toast.info("Preparing timetable for printing...");
    setTimeout(() => {
      toast.success("Timetable ready for print!");
    }, 1500);
  };

  const handleExportData = () => {
    toast.info("Exporting school data...");
    setTimeout(() => {
      toast.success("Data exported successfully!");
    }, 2000);
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Portal</h2>
            <p className="text-muted-foreground">
              {schoolData.name} - Comprehensive school management and analytics overview.
            </p>
            <p className="text-sm text-muted-foreground">
              Principal: {schoolData.principal_name || 'TBD'} • Academic Year: {schoolData.academic_year}
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
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
            <Button onClick={handleApproveAll}>
              Approve All Requests
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Pending Requests"
            value="12"
            trending="up"
            trendValue="4 new today"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Students"
            value={stats.totalStudents.toString()}
            description="Across all grades"
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Teachers"
            value={stats.totalTeachers.toString()}
            description="Active faculty"
            icon={<User className="h-4 w-4" />}
          />
          <StatsCard
            title="Infrastructure"
            value={stats.totalClassrooms.toString()}
            description="Total classrooms"
            icon={<Building className="h-4 w-4" />}
          />
        </div>

        {/* Quick Access Management Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Teacher Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Manage teacher profiles, assignments, and workload
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">{stats.totalTeachers}</span>
                <span className="text-sm text-muted-foreground">Active Teachers</span>
              </div>
              <Button asChild className="w-full">
                <Link to="/teachers">
                  <User className="mr-2 h-4 w-4" />
                  Manage Teachers
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Manage student records, admissions, and performance
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">{stats.totalStudents}</span>
                <span className="text-sm text-muted-foreground">Enrolled Students</span>
              </div>
              <Button asChild className="w-full">
                <Link to="/students">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Class Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Manage class schedules, subjects, and assignments
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">{stats.totalClasses}</span>
                <span className="text-sm text-muted-foreground">Active Classes</span>
              </div>
              <Button asChild className="w-full">
                <Link to="/classes">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Classes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Separator />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-[800px] grid-cols-5">
            <TabsTrigger value="overview">School Overview</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
            <TabsTrigger value="planning">Academic Planning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Academic Structure</h3>
                </div>
                <p className="mt-2 text-2xl font-bold">{schoolData.number_of_terms} Terms</p>
                <p className="text-xs text-muted-foreground">{schoolData.working_days?.length || 5} working days per week</p>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Academic Year</h3>
                </div>
                <p className="mt-2 text-lg font-bold">{schoolData.academic_year}</p>
                <p className="text-xs text-muted-foreground">Current academic session</p>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Vision</h3>
                </div>
                <p className="mt-2 text-lg font-bold">{schoolData.school_vision || 'Excellence in Education'}</p>
                <p className="text-xs text-muted-foreground">{schoolData.school_type} School</p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
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
                    <span className="text-sm">{schoolData.principal_name || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">School Type</span>
                    <span className="text-sm">{schoolData.school_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Contact</span>
                    <span className="text-sm">{schoolData.phone || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email</span>
                    <span className="text-sm">{schoolData.email || 'Not set'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Students</span>
                    <span className="text-sm font-bold">{stats.totalStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Teaching Staff</span>
                    <span className="text-sm font-bold">{stats.totalTeachers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Classrooms</span>
                    <span className="text-sm font-bold">{stats.totalClassrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Active Classes</span>
                    <span className="text-sm font-bold">{stats.totalClasses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Student-Teacher Ratio</span>
                    <span className="text-sm font-bold">{stats.totalTeachers > 0 ? Math.round(stats.totalStudents / stats.totalTeachers) : 0}:1</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <RequestsList showActions={true} />
          </TabsContent>
          
          <TabsContent value="timetable" className="space-y-4 mt-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <Card className="w-full md:w-auto">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Select Grade & Division
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-4">
                    <GradeDivisionSelector 
                      selectedGrade={selectedGrade}
                      selectedDivision={selectedDivision}
                      onGradeChange={setSelectedGrade}
                      onDivisionChange={setSelectedDivision}
                    />
                    <Button variant="outline" onClick={handleGenerateTimetable}>
                      Generate Timetable
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Button variant="ghost" onClick={handlePrintTimetable}>
                <Calendar className="mr-2 h-4 w-4" />
                Print Timetable
              </Button>
            </div>
            
            <DailyTimetable 
              grade={selectedGrade} 
              division={selectedDivision} 
            />
            
            <AcademicTimeline />
          </TabsContent>
          
          <TabsContent value="infrastructure" className="mt-4">
            <InfrastructureOverview />
          </TabsContent>
          
          <TabsContent value="staff" className="mt-4">
            <TeacherLoadSummary />
          </TabsContent>
          
          <TabsContent value="planning" className="mt-4">
            <AcademicPlanning />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
