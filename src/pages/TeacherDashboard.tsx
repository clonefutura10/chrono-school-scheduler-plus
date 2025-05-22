
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequestForm } from '@/components/requests/RequestForm';
import { RequestsList } from '@/components/requests/RequestsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeacherDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your schedule and request timetable changes.
          </p>
        </div>
        
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="new-request">New Request</TabsTrigger>
          </TabsList>
          
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
