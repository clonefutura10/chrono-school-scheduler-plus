
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AttendanceChart } from '@/components/student/AttendanceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const attendanceData = [
  { date: '2025-01-20', status: 'Present', subject: 'Mathematics' },
  { date: '2025-01-19', status: 'Present', subject: 'English' },
  { date: '2025-01-18', status: 'Absent', subject: 'Science', reason: 'Medical' },
  { date: '2025-01-17', status: 'Present', subject: 'History' },
  { date: '2025-01-16', status: 'Late', subject: 'Geography' },
  { date: '2025-01-15', status: 'Present', subject: 'Mathematics' },
];

const monthlyStats = {
  totalDays: 20,
  presentDays: 17,
  absentDays: 2,
  lateDays: 1,
  attendancePercentage: 85
};

const AttendancePage = () => {
  const handleMarkToday = () => {
    toast.success("Attendance marked for today");
  };

  const handleRequestLeave = () => {
    toast.info("Leave request form opened");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Attendance Record</h2>
            <p className="text-muted-foreground">
              Track your attendance and manage leave requests
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRequestLeave}>
              <Calendar className="mr-2 h-4 w-4" />
              Request Leave
            </Button>
            <Button onClick={handleMarkToday}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Today
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Present Days</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{monthlyStats.presentDays}</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Absent Days</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{monthlyStats.absentDays}</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Late Days</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{monthlyStats.lateDays}</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Attendance Rate</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{monthlyStats.attendancePercentage}%</div>
              <div className="text-xs text-muted-foreground">Overall</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AttendanceChart />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceData.slice(0, 6).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {record.status === 'Present' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {record.status === 'Absent' && <XCircle className="h-4 w-4 text-red-500" />}
                      {record.status === 'Late' && <Clock className="h-4 w-4 text-yellow-500" />}
                      <div>
                        <div className="font-medium text-sm">{record.date}</div>
                        <div className="text-xs text-muted-foreground">{record.subject}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={record.status === 'Present' ? 'default' : record.status === 'Absent' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {record.status}
                      </Badge>
                      {record.reason && (
                        <div className="text-xs text-muted-foreground mt-1">{record.reason}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AttendancePage;
