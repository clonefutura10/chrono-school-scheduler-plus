
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequestsList } from '@/components/requests/RequestsList';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar, User } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage timetable changes and monitor school activities.
          </p>
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
        
        <RequestsList showActions={true} />
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
