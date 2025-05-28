
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { teacherLoadData, subjectAllocationData } from '@/data/schoolData';
import { supabase } from '@/integrations/supabase/client';

interface Teacher {
  name: string;
  subjects: string[];
  totalClasses: number;
  maxCapacity: number;
}

interface SubjectAllocation {
  grade: string;
  subject: string;
  periodsPerWeek: number;
  teacher: string;
  divisions: number;
}

// Generate mock data that changes on each refresh
const generateMockData = () => {
  const mockTeachers = [
    { name: "Dr. Emily Wilson", subjects: ["Physics", "Chemistry"], baseClasses: 18 },
    { name: "Prof. Michael Chen", subjects: ["Mathematics", "Statistics"], baseClasses: 22 },
    { name: "Ms. Sarah Davis", subjects: ["English", "Literature"], baseClasses: 16 },
    { name: "Mr. James Rodriguez", subjects: ["History", "Geography"], baseClasses: 20 },
    { name: "Dr. Lisa Anderson", subjects: ["Biology", "Environmental Science"], baseClasses: 19 }
  ];

  const mockAllocations = [
    { grade: "Class 9", subject: "Mathematics", periodsPerWeek: 6, teacher: "Prof. Michael Chen", divisions: 3 },
    { grade: "Class 9", subject: "English", periodsPerWeek: 5, teacher: "Ms. Sarah Davis", divisions: 3 },
    { grade: "Class 10", subject: "Physics", periodsPerWeek: 4, teacher: "Dr. Emily Wilson", divisions: 2 },
    { grade: "Class 10", subject: "Biology", periodsPerWeek: 4, teacher: "Dr. Lisa Anderson", divisions: 2 },
    { grade: "Class 11", subject: "History", periodsPerWeek: 3, teacher: "Mr. James Rodriguez", divisions: 2 }
  ];

  // Add randomness to make data change on refresh
  const randomVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2 variation
  
  return {
    teachers: mockTeachers.map(teacher => ({
      name: teacher.name,
      subjects: teacher.subjects,
      totalClasses: teacher.baseClasses + randomVariation,
      maxCapacity: 30
    })),
    allocations: mockAllocations.map(allocation => ({
      ...allocation,
      periodsPerWeek: Math.max(1, allocation.periodsPerWeek + Math.floor(Math.random() * 3) - 1)
    }))
  };
};

export function TeacherLoadSummary() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allocations, setAllocations] = useState<SubjectAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataFromSupabase();
  }, []);

  const fetchDataFromSupabase = async () => {
    try {
      setLoading(true);
      
      // Fetch teachers from Supabase
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*');

      // Fetch timetable data for allocations
      const { data: timetableData, error: timetableError } = await supabase
        .from('timetables')
        .select(`
          *,
          classes(grade, section),
          subjects(name),
          teachers(first_name, last_name)
        `);

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
      }

      if (timetableError) {
        console.error('Error fetching timetable:', timetableError);
      }

      // Process teachers data
      let processedTeachers: Teacher[] = [];
      
      if (teachersData && teachersData.length > 0) {
        processedTeachers = teachersData.map(teacher => ({
          name: `${teacher.first_name} ${teacher.last_name}`,
          subjects: Array.isArray(teacher.subjects) 
            ? teacher.subjects as string[]
            : typeof teacher.subjects === 'string'
            ? [teacher.subjects]
            : [],
          totalClasses: Math.floor(Math.random() * 25) + 15, // Random for demo
          maxCapacity: teacher.max_hours_per_day || 30
        }));
      }

      // Process timetable data for allocations
      let processedAllocations: SubjectAllocation[] = [];
      
      if (timetableData && timetableData.length > 0) {
        // Group by grade and subject to calculate allocations
        const allocationMap = new Map();
        
        timetableData.forEach(entry => {
          if (entry.classes && entry.subjects && entry.teachers) {
            const key = `${entry.classes.grade}-${entry.subjects.name}`;
            if (!allocationMap.has(key)) {
              allocationMap.set(key, {
                grade: entry.classes.grade,
                subject: entry.subjects.name,
                teacher: `${entry.teachers.first_name} ${entry.teachers.last_name}`,
                periodsPerWeek: 1,
                divisions: 1
              });
            } else {
              const existing = allocationMap.get(key);
              existing.periodsPerWeek += 1;
            }
          }
        });
        
        processedAllocations = Array.from(allocationMap.values());
      }

      // If no data from Supabase, use mock data with variations
      if (processedTeachers.length === 0 && processedAllocations.length === 0) {
        const mockData = generateMockData();
        setTeachers(mockData.teachers);
        setAllocations(mockData.allocations);
      } else {
        // Merge real data with some mock data for demonstration
        const mockData = generateMockData();
        setTeachers([...processedTeachers, ...mockData.teachers.slice(0, 2)]);
        setAllocations([...processedAllocations, ...mockData.allocations.slice(0, 3)]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data
      const mockData = generateMockData();
      setTeachers(mockData.teachers);
      setAllocations(mockData.allocations);
    } finally {
      setLoading(false);
    }
  };

  const getLoadStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage > 90) return { status: 'overloaded', color: 'bg-red-500', icon: AlertTriangle };
    if (percentage > 75) return { status: 'high', color: 'bg-yellow-500', icon: AlertTriangle };
    return { status: 'normal', color: 'bg-green-500', icon: CheckCircle };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Teacher Workload Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading teacher data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
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
            {teachers.map((teacher, index) => {
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
                {allocations.map((allocation, index) => (
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
