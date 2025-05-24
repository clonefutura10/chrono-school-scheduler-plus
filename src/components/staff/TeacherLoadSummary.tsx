
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const teacherData = [
  { name: "Mrs. Sharma", subjects: ["English (Class 1-4)"], totalClasses: 24, maxCapacity: 30 },
  { name: "Mr. Verma", subjects: ["Math (Class 1-3)"], totalClasses: 18, maxCapacity: 30 },
  { name: "Mrs. Fernandez", subjects: ["EVS (Class 1-2)"], totalClasses: 12, maxCapacity: 25 },
  { name: "Mr. Khan", subjects: ["Science (Class 10)"], totalClasses: 18, maxCapacity: 30 },
  { name: "Sarah Johnson", subjects: ["English (Class 9-10)"], totalClasses: 22, maxCapacity: 30 },
  { name: "Michael Brown", subjects: ["Physics (Class 11-12)"], totalClasses: 20, maxCapacity: 30 },
  { name: "Jessica Lee", subjects: ["Chemistry (Class 11-12)"], totalClasses: 18, maxCapacity: 30 },
  { name: "Karen Williams", subjects: ["Biology (Class 11-12)"], totalClasses: 19, maxCapacity: 30 },
  { name: "Emily Clark", subjects: ["Computer Science"], totalClasses: 15, maxCapacity: 30 },
  { name: "Robert Johnson", subjects: ["Physical Education"], totalClasses: 25, maxCapacity: 35 },
];

const subjectAllocation = [
  { grade: "Class 1", subject: "English", periodsPerWeek: 5, teacher: "Mrs. Sharma", divisions: 3 },
  { grade: "Class 1", subject: "Math", periodsPerWeek: 5, teacher: "Mr. Verma", divisions: 3 },
  { grade: "Class 1", subject: "EVS", periodsPerWeek: 3, teacher: "Mrs. Fernandez", divisions: 3 },
  { grade: "Class 10", subject: "Science", periodsPerWeek: 6, teacher: "Mr. Khan", divisions: 3 },
  { grade: "Class 10", subject: "English", periodsPerWeek: 4, teacher: "Sarah Johnson", divisions: 3 },
  { grade: "Class 10", subject: "Math", periodsPerWeek: 6, teacher: "John Smith", divisions: 3 },
];

export function TeacherLoadSummary() {
  const getLoadStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage > 90) return { status: 'overloaded', color: 'bg-red-500', icon: AlertTriangle };
    if (percentage > 75) return { status: 'high', color: 'bg-yellow-500', icon: AlertTriangle };
    return { status: 'normal', color: 'bg-green-500', icon: CheckCircle };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Workload Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherData.map((teacher, index) => {
              const loadStatus = getLoadStatus(teacher.totalClasses, teacher.maxCapacity);
              const percentage = (teacher.totalClasses / teacher.maxCapacity) * 100;
              const Icon = loadStatus.icon;
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{teacher.name}</h4>
                      <Icon className={`h-4 w-4 ${loadStatus.status === 'overloaded' ? 'text-red-500' : loadStatus.status === 'high' ? 'text-yellow-500' : 'text-green-500'}`} />
                    </div>
                    <Badge variant={loadStatus.status === 'overloaded' ? 'destructive' : 'outline'}>
                      {teacher.totalClasses}/{teacher.maxCapacity} classes
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                      {teacher.subjects.map((subject, idx) => (
                        <span key={idx}>{subject}</span>
                      ))}
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage.toFixed(0)}% capacity</span>
                      <span>{teacher.maxCapacity - teacher.totalClasses} classes available</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Allocation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Grade</th>
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Periods/Week</th>
                  <th className="text-left p-2">Teacher</th>
                  <th className="text-left p-2">Divisions</th>
                  <th className="text-left p-2">Total Classes</th>
                </tr>
              </thead>
              <tbody>
                {subjectAllocation.map((allocation, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{allocation.grade}</td>
                    <td className="p-2">{allocation.subject}</td>
                    <td className="p-2">{allocation.periodsPerWeek}</td>
                    <td className="p-2">{allocation.teacher}</td>
                    <td className="p-2">{allocation.divisions}</td>
                    <td className="p-2 font-medium">
                      {allocation.periodsPerWeek * allocation.divisions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
