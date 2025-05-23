
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequestsList } from '@/components/requests/RequestsList';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar, User, BookOpen, School } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyTimetable } from '@/components/timetable/DailyTimetable';
import { GradeDivisionSelector } from '@/components/timetable/GradeDivisionSelector';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AcademicTimeline } from '@/components/timeline/AcademicTimeline';

const AdminDashboard = () => {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedDivision, setSelectedDivision] = useState('A');

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
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <p className="text-muted-foreground">
              Manage timetable changes and monitor school activities.
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
            title="Approved Changes"
            value="28"
            description="This month"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Teachers"
            value="48"
            icon={<User className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Students"
            value="1,400"
            icon={<User className="h-4 w-4" />}
          />
        </div>
        
        <Separator />

        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="timetable">Timetable Management</TabsTrigger>
            <TabsTrigger value="requests">Change Requests</TabsTrigger>
            <TabsTrigger value="statistics">School Statistics</TabsTrigger>
          </TabsList>
          
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
          
          <TabsContent value="requests" className="mt-4">
            <RequestsList showActions={true} />
          </TabsContent>
          
          <TabsContent value="statistics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>School Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <School className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Grades</h3>
                    </div>
                    <p className="mt-2 text-2xl font-bold">10</p>
                    <p className="text-xs text-muted-foreground">With 4 divisions each</p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Students per Division</h3>
                    </div>
                    <p className="mt-2 text-2xl font-bold">35</p>
                    <p className="text-xs text-muted-foreground">Average class size</p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Subjects</h3>
                    </div>
                    <p className="mt-2 text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Across all grades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
