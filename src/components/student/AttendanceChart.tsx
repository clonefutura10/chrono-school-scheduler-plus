
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

const data = [
  { month: 'Jan', attendance: 95 },
  { month: 'Feb', attendance: 90 },
  { month: 'Mar', attendance: 88 },
  { month: 'Apr', attendance: 92 },
  { month: 'May', attendance: 95 },
  { month: 'Jun', attendance: 89 },
  { month: 'Jul', attendance: 91 },
  { month: 'Aug', attendance: 92 },
  { month: 'Sep', attendance: 94 },
  { month: 'Oct', attendance: 97 },
];

export function AttendanceChart() {
  const handleViewAbsences = () => {
    toast.info("Viewing absence details");
  };

  const handleMarkAttendance = () => {
    toast.success("Attendance marked for today");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance History</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleViewAbsences}>
            View Absences
          </Button>
          <Button size="sm" onClick={handleMarkAttendance}>
            <Calendar className="mr-2 h-4 w-4" />
            Mark Today
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Attendance']}
              />
              <Bar dataKey="attendance" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
