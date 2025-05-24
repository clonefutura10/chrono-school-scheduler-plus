
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, BookOpen, GraduationCap, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DailyTimetable } from '@/components/timetable/DailyTimetable';
import { GradeDivisionSelector } from '@/components/timetable/GradeDivisionSelector';
import { studentStrengthData, subjectAllocationData, teacherLoadData } from '@/data/schoolData';

// Generate class data from school data
const generateClassData = () => {
  return studentStrengthData.map((gradeData, index) => {
    const gradeDivisions = [];
    for (let i = 0; i < gradeData.divisions; i++) {
      const division = String.fromCharCode(65 + i); // A, B, C, etc.
      const studentsPerDivision = Math.round(gradeData.totalStudents / gradeData.divisions);
      
      // Find relevant subjects for this grade
      const gradeSubjects = subjectAllocationData
        .filter(subject => subject.grade === gradeData.grade)
        .map(subject => subject.subject);
      
      // Find class teacher
      const possibleTeachers = teacherLoadData.filter(teacher => 
        teacher.subjects.some(sub => gradeSubjects.some(gradeSub => sub.includes(gradeSub)))
      );
      const classTeacher = possibleTeachers[Math.floor(Math.random() * possibleTeachers.length)]?.name || "TBD";
      
      gradeDivisions.push({
        id: `${gradeData.grade}-${division}`,
        grade: gradeData.grade.replace('Class ', ''),
        division: division,
        students: studentsPerDivision,
        subjects: gradeSubjects,
        classTeacher: classTeacher
      });
    }
    return gradeDivisions;
  }).flat();
};

const mockClasses = generateClassData();

// Mock data for students in a class
const mockStudents = [
  { id: 1, name: "Alex Johnson", rollNo: "10A01", attendance: 95, performance: "Excellent" },
  { id: 2, name: "Emily Chen", rollNo: "10A02", attendance: 89, performance: "Good" },
  { id: 3, name: "Michael Davis", rollNo: "10A03", attendance: 92, performance: "Good" },
  { id: 4, name: "Sophia Lee", rollNo: "10A04", attendance: 98, performance: "Excellent" },
  { id: 5, name: "Ryan Smith", rollNo: "10A05", attendance: 85, performance: "Average" },
];

const getPerformanceBadge = (performance) => {
  switch (performance) {
    case 'Excellent': return <Badge className="bg-green-500">Excellent</Badge>;
    case 'Good': return <Badge className="bg-blue-500">Good</Badge>;
    case 'Average': return <Badge className="bg-yellow-500">Average</Badge>;
    case 'Need Improvement': return <Badge className="bg-red-500">Need Improvement</Badge>;
    default: return <Badge>{performance}</Badge>;
  }
};

const ClassesPage = () => {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [selectedClass, setSelectedClass] = useState(mockClasses.find(c => c.grade === '10' && c.division === 'A'));
  
  const handleClassSelect = (grade, division) => {
    setSelectedGrade(grade);
    setSelectedDivision(division);
    
    const classInfo = mockClasses.find(c => c.grade === grade && c.division === division);
    setSelectedClass(classInfo);
    
    toast.success(`Selected Class: ${grade}-${division}`);
  };
  
  const handleSendMessage = () => {
    toast.success(`Message sent to Class ${selectedGrade}-${selectedDivision}`);
  };
  
  const handleGenerateReport = () => {
    toast.success(`Report generated for Class ${selectedGrade}-${selectedDivision}`);
  };
  
  const handleScheduleTest = () => {
    toast.success(`Test scheduled for Class ${selectedGrade}-${selectedDivision}`);
  };

  // Get subject allocation for selected class
  const getSubjectProgress = () => {
    const gradeKey = `Class ${selectedGrade}`;
    const relevantSubjects = subjectAllocationData.filter(subject => subject.grade === gradeKey);
    
    return relevantSubjects.map(subject => ({
      subject: subject.subject,
      teacher: subject.teacher,
      weeksCompleted: Math.floor(Math.random() * 20) + 10,
      totalWeeks: 24,
      sessions: subject.periodsPerWeek
    }));
  };

  const subjectProgress = getSubjectProgress();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
            <p className="text-muted-foreground">
              Manage your classes and view class details.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSendMessage}>
              Send Class Message
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <GradeDivisionSelector
                selectedGrade={selectedGrade}
                selectedDivision={selectedDivision}
                onGradeChange={setSelectedGrade}
                onDivisionChange={setSelectedDivision}
              />
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleClassSelect(selectedGrade, selectedDivision)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Class
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleGenerateReport}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedClass && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Class Information</CardTitle>
                <CardDescription>
                  Grade {selectedClass.grade}-{selectedClass.division}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="font-medium">{selectedClass.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Class Teacher</span>
                    <span className="font-medium">{selectedClass.classTeacher}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subjects</span>
                    <span className="font-medium">{selectedClass.subjects.length}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedClass.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Class performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Attendance Rate</div>
                    <div className="text-2xl font-bold">92%</div>
                    <div className="mt-1 text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Average Performance</div>
                    <div className="text-2xl font-bold">B+</div>
                    <div className="mt-1 text-xs text-muted-foreground">Current term</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Assignments Completion</div>
                    <div className="text-2xl font-bold">88%</div>
                    <div className="mt-1 text-xs text-muted-foreground">On-time submission rate</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Syllabus Progress</div>
                    <div className="text-2xl font-bold">65%</div>
                    <div className="mt-1 text-xs text-muted-foreground">Across all subjects</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="timetable">Class Timetable</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects & Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timetable" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Timetable</CardTitle>
                <CardDescription>
                  Weekly timetable for Grade {selectedGrade}-{selectedDivision}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button variant="outline" onClick={handleScheduleTest}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Test/Event
                  </Button>
                </div>
                <DailyTimetable 
                  grade={selectedGrade} 
                  division={selectedDivision} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Students in Grade {selectedGrade}-{selectedDivision}</CardTitle>
                <CardDescription>
                  Total students: {mockStudents.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">Roll No: {student.rollNo}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Attendance</div>
                          <div className={`text-sm font-medium ${student.attendance < 90 ? 'text-red-500' : 'text-green-500'}`}>
                            {student.attendance}%
                          </div>
                        </div>
                        <div className="w-32 text-center">
                          <div className="text-sm text-muted-foreground">Performance</div>
                          <div>
                            {getPerformanceBadge(student.performance)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4" />
                          <span className="sr-only">View Profile</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subjects" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
                <CardDescription>
                  Syllabus completion and subject details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjectProgress.map((subject, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="font-medium text-lg">{subject.subject}</div>
                          <div className="text-sm text-muted-foreground">Teacher: {subject.teacher}</div>
                          <div className="text-sm text-muted-foreground">{subject.sessions} sessions per week</div>
                        </div>
                        <div className="flex flex-col items-start md:items-end">
                          <div className="text-sm font-medium">Syllabus Progress</div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-600 h-full rounded-full" 
                                style={{ width: `${(subject.weeksCompleted / subject.totalWeeks) * 100}%` }} 
                              />
                            </div>
                            <span className="text-sm">{Math.round((subject.weeksCompleted / subject.totalWeeks) * 100)}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {subject.weeksCompleted}/{subject.totalWeeks} weeks completed
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button variant="outline" size="sm">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ClassesPage;
