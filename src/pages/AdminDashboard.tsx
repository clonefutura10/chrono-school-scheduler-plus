
import React, { useState } from 'react';
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
import { studentStrengthData, teacherLoadData, academicStructure, schoolInfrastructure } from '@/data/schoolData';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedDivision, setSelectedDivision] = useState('A');

  const totalStudents = studentStrengthData.reduce((sum, grade) => sum + grade.totalStudents, 0);
  const totalTeachers = teacherLoadData.length;

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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Portal</h2>
            <p className="text-muted-foreground">
              Comprehensive school management and analytics overview.
            </p>
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
            value={totalStudents.toString()}
            description="Across all grades"
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Teachers"
            value={totalTeachers.toString()}
            description="Active faculty"
            icon={<User className="h-4 w-4" />}
          />
          <StatsCard
            title="Infrastructure"
            value={schoolInfrastructure.totalClassrooms.toString()}
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
                <p className="mt-2 text-2xl font-bold">{academicStructure.terms.length} Terms</p>
                <p className="text-xs text-muted-foreground">{academicStructure.workingDays} working days per year</p>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Academic Year</h3>
                </div>
                <p className="mt-2 text-lg font-bold">2025-26</p>
                <p className="text-xs text-muted-foreground">June 2025 - March 2026</p>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Vision Theme</h3>
                </div>
                <p className="mt-2 text-lg font-bold">{academicStructure.theme}</p>
                <p className="text-xs text-muted-foreground">NEP 2020 guidelines integrated</p>
              </div>
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
