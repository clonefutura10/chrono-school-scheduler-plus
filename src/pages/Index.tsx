
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DailyTimetable } from '@/components/timetable/DailyTimetable';
import { GradeDivisionSelector } from '@/components/timetable/GradeDivisionSelector';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [selectedGrade, setSelectedGrade] = React.useState('10');
  const [selectedDivision, setSelectedDivision] = React.useState('A');

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to your school timetable dashboard.
            </p>
          </div>
          <div>
            <Button>
              <Calendar className="mr-2 h-4 w-4" /> Today's Schedule
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Classes"
            value="32"
            description="This week's scheduled classes"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatsCard
            title="Teachers"
            value="24"
            description="Active teaching staff"
            icon={<User className="h-4 w-4" />}
          />
          <StatsCard
            title="Students"
            value="1,400"
            description="Across all grades and divisions"
            icon={<User className="h-4 w-4" />}
          />
          <StatsCard
            title="Change Requests"
            value="8"
            trending="up"
            trendValue="2 new today"
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <Separator />

        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="timetable">Timetable View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
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
                  <GradeDivisionSelector 
                    selectedGrade={selectedGrade}
                    selectedDivision={selectedDivision}
                    onGradeChange={setSelectedGrade}
                    onDivisionChange={setSelectedDivision}
                  />
                </CardContent>
              </Card>
            </div>
            
            <DailyTimetable 
              grade={selectedGrade} 
              division={selectedDivision} 
            />
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-4">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Weekly view and summary statistics will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Index;
