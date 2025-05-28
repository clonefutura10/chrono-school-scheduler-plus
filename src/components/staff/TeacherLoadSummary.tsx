
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  subjects: string[];
  max_hours_per_day: number;
  email: string;
  department: string;
}

interface SubjectAllocation {
  subject: string;
  teacher: string;
  grade: string;
  periods: number;
  divisions: number;
}

export function TeacherLoadSummary() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjectAllocations, setSubjectAllocations] = useState<SubjectAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch teachers
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*');

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
        return;
      }

      // Fetch timetables with related data for workload calculation
      const { data: timetablesData, error: timetablesError } = await supabase
        .from('timetables')
        .select(`
          *,
          teachers(id, first_name, last_name),
          subjects(name),
          classes(grade, section)
        `);

      if (timetablesError) {
        console.error('Error fetching timetables:', timetablesError);
      }

      setTeachers(teachersData || []);
      
      // Process subject allocations from timetable data
      if (timetablesData) {
        const allocations = processSubjectAllocations(timetablesData);
        setSubjectAllocations(allocations);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processSubjectAllocations = (timetablesData: any[]) => {
    const allocationMap = new Map();
    
    timetablesData.forEach((item) => {
      const key = `${item.subjects?.name}-${item.teachers?.first_name} ${item.teachers?.last_name}-${item.classes?.grade}`;
      
      if (!allocationMap.has(key)) {
        allocationMap.set(key, {
          subject: item.subjects?.name || 'General',
          teacher: `${item.teachers?.first_name || ''} ${item.teachers?.last_name || ''}`.trim() || 'Staff',
          grade: item.classes?.grade || 'Class 10',
          periods: 0,
          divisions: new Set()
        });
      }
      
      const allocation = allocationMap.get(key);
      allocation.periods += 1;
      allocation.divisions.add(item.classes?.section || 'A');
    });

    return Array.from(allocationMap.values()).map(item => ({
      ...item,
      divisions: item.divisions.size
    }));
  };

  const getTeacherWorkload = (teacher: Teacher) => {
    // Count classes for this teacher from timetables
    const teacherName = `${teacher.first_name} ${teacher.last_name}`;
    const teacherClasses = subjectAllocations.filter(alloc => 
      alloc.teacher === teacherName
    ).reduce((sum, alloc) => sum + alloc.periods, 0);
    
    const maxCapacity = (teacher.max_hours_per_day || 4) * 5; // 5 days per week
    return {
      current: teacherClasses,
      max: maxCapacity,
      percentage: (teacherClasses / maxCapacity) * 100
    };
  };

  const getLoadStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage > 90) return { status: 'overloaded', color: 'bg-red-500', icon: AlertTriangle };
    if (percentage > 75) return { status: 'high', color: 'bg-yellow-500', icon: AlertTriangle };
    return { status: 'normal', color: 'bg-green-500', icon: CheckCircle };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Teacher Workload Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading teacher data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Workload Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No teachers found. Please set up teachers in the setup portal first.
              </div>
            ) : (
              teachers.map((teacher, index) => {
                const workload = getTeacherWorkload(teacher);
                const loadStatus = getLoadStatus(workload.current, workload.max);
                const Icon = loadStatus.icon;
                
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{teacher.first_name} {teacher.last_name}</h4>
                        <Icon className={`h-4 w-4 ${loadStatus.status === 'overloaded' ? 'text-red-500' : loadStatus.status === 'high' ? 'text-yellow-500' : 'text-green-500'}`} />
                      </div>
                      <Badge variant={loadStatus.status === 'overloaded' ? 'destructive' : 'outline'}>
                        {workload.current}/{workload.max} classes
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                        {Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : 'General'}
                      </div>
                      <Progress value={workload.percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{workload.percentage.toFixed(0)}% capacity</span>
                        <span>{workload.max - workload.current} classes available</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Allocation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectAllocations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subject allocations found. Generate a timetable to see allocations.
            </div>
          ) : (
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
                  {subjectAllocations.map((allocation, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{allocation.grade}</td>
                      <td className="p-2">{allocation.subject}</td>
                      <td className="p-2">{allocation.periods}</td>
                      <td className="p-2">{allocation.teacher}</td>
                      <td className="p-2">{allocation.divisions}</td>
                      <td className="p-2 font-medium">
                        {allocation.periods * allocation.divisions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
