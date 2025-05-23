
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { CalendarCheck, FileSpreadsheet, Download, FileText, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AttendanceChart } from '@/components/student/AttendanceChart';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Mock data
const mockGradesAndDivisions = [
  { grade: "9", divisions: ["A", "B", "C", "D"] },
  { grade: "10", divisions: ["A", "B", "C", "D"] },
  { grade: "11", divisions: ["A", "B", "C"] },
  { grade: "12", divisions: ["A", "B"] },
];

const mockStudents = [
  { id: 1, name: "Alex Johnson", rollNo: "10A01", grade: "10", division: "A", attendance: 95 },
  { id: 2, name: "Emily Chen", rollNo: "10A02", grade: "10", division: "A", attendance: 89 },
  { id: 3, name: "Michael Davis", rollNo: "10A03", grade: "10", division: "A", attendance: 92 },
  { id: 4, name: "Sophia Lee", rollNo: "10A04", grade: "10", division: "A", attendance: 98 },
  { id: 5, name: "Ryan Smith", rollNo: "10A05", grade: "10", division: "A", attendance: 85 },
  { id: 6, name: "Isabella Garcia", rollNo: "10A06", grade: "10", division: "A", attendance: 97 },
  { id: 7, name: "Jason Wilson", rollNo: "10A07", grade: "10", division: "A", attendance: 90 },
  { id: 8, name: "Olivia Brown", rollNo: "10A08", grade: "10", division: "A", attendance: 93 },
];

// Mock attendance records for today
const generateMockAttendanceForToday = () => {
  return mockStudents.map(student => ({
    ...student,
    status: Math.random() > 0.1 ? 'Present' : 'Absent',
    date: new Date()
  }));
};

// Mock attendance history
const mockAttendanceHistory = [
  { date: '2025-05-20', present: 28, absent: 2, total: 30 },
  { date: '2025-05-21', present: 29, absent: 1, total: 30 },
  { date: '2025-05-22', present: 27, absent: 3, total: 30 },
  { date: '2025-05-23', present: 30, absent: 0, total: 30 },
];

const AttendanceManagement = () => {
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [todayAttendance, setTodayAttendance] = useState(generateMockAttendanceForToday());
  const [isTakeAttendanceDialogOpen, setIsTakeAttendanceDialogOpen] = useState(false);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);
  const [attendanceStudents, setAttendanceStudents] = useState(
    mockStudents.map(student => ({ ...student, isPresent: true }))
  );

  const handleTakeAttendance = () => {
    const updatedAttendance = attendanceStudents.map(student => ({
      ...student,
      status: student.isPresent ? 'Present' : 'Absent',
      date: date
    }));
    
    setTodayAttendance(updatedAttendance);
    setIsTakeAttendanceDialogOpen(false);
    toast.success(`Attendance recorded for ${format(date, 'PPP')}`);
  };

  const handleAttendanceChange = (id, checked) => {
    setAttendanceStudents(attendanceStudents.map(student => 
      student.id === id ? { ...student, isPresent: checked } : student
    ));
  };

  const handleMarkAll = (status) => {
    setAttendanceStudents(attendanceStudents.map(student => ({ ...student, isPresent: status })));
    
    toast.success(`All students marked as ${status ? 'present' : 'absent'}`);
  };

  const handleExportAttendance = () => {
    toast.success("Attendance data exported successfully.");
  };

  const handleGenerateReport = () => {
    toast.success("Attendance report generated successfully.");
  };
  
  // Filter students based on search
  const filteredAttendance = todayAttendance.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
            <p className="text-muted-foreground">
              Track, record, and analyze student attendance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isTakeAttendanceDialogOpen} onOpenChange={setIsTakeAttendanceDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Take Attendance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Record Attendance</DialogTitle>
                  <DialogDescription>
                    Mark present or absent for each student.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label>Grade</Label>
                        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockGradesAndDivisions.map(item => (
                              <SelectItem key={item.grade} value={item.grade}>{item.grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Division</Label>
                        <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockGradesAndDivisions
                              .find(item => item.grade === selectedGrade)?.divisions
                              .map(division => (
                                <SelectItem key={division} value={division}>{division}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            {format(date, 'PPP')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Students</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleMarkAll(true)}>
                        <Check className="mr-1 h-4 w-4" />
                        Mark All Present
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleMarkAll(false)}>
                        <X className="mr-1 h-4 w-4" />
                        Mark All Absent
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-[300px] overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Present</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceStudents
                          .filter(student => student.grade === selectedGrade && student.division === selectedDivision)
                          .map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>{student.rollNo}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell className="text-right">
                                <Checkbox 
                                  checked={student.isPresent} 
                                  onCheckedChange={(checked) => handleAttendanceChange(student.id, checked)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTakeAttendanceDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleTakeAttendance}>Save Attendance</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isViewReportDialogOpen} onOpenChange={setIsViewReportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Attendance Report</DialogTitle>
                  <DialogDescription>
                    Attendance summary for selected period.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Grade</Label>
                      <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockGradesAndDivisions.map(item => (
                            <SelectItem key={item.grade} value={item.grade}>Grade {item.grade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Division</Label>
                      <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockGradesAndDivisions
                            .find(item => item.grade === selectedGrade)?.divisions
                            .map(division => (
                              <SelectItem key={division} value={division}>Division {division}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Period</Label>
                      <Select defaultValue="month">
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="term">This Term</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <AttendanceChart />
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Attendance Summary</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Absent</TableHead>
                          <TableHead>Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAttendanceHistory.map((record) => (
                          <TableRow key={record.date}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.present}</TableCell>
                            <TableCell>{record.absent}</TableCell>
                            <TableCell>
                              {((record.present / record.total) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewReportDialogOpen(false)}>Close</Button>
                  <Button onClick={handleGenerateReport}>Generate PDF</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={handleExportAttendance}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Tabs defaultValue="today" className="w-full">
          <TabsList>
            <TabsTrigger value="today">Today's Attendance</TabsTrigger>
            <TabsTrigger value="stats">Attendance Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance for {format(new Date(), 'PPP')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-sm text-green-700">Present</p>
                    <h3 className="text-2xl font-bold">{todayAttendance.filter(s => s.status === 'Present').length}</h3>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-700">Absent</p>
                    <h3 className="text-2xl font-bold">{todayAttendance.filter(s => s.status === 'Absent').length}</h3>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-sm text-blue-700">Attendance Rate</p>
                    <h3 className="text-2xl font-bold">
                      {((todayAttendance.filter(s => s.status === 'Present').length / todayAttendance.length) * 100).toFixed(1)}%
                    </h3>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.rollNo}</TableCell>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell>{record.grade}</TableCell>
                        <TableCell>{record.division}</TableCell>
                        <TableCell>
                          {record.status === 'Present' ? (
                            <Badge className="bg-green-500">Present</Badge>
                          ) : (
                            <Badge className="bg-red-500">Absent</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <AttendanceChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Class Attendance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p>Grade 9-A</p>
                      <div className="flex items-center gap-2">
                        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '96%' }} />
                        </div>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Grade 9-B</p>
                      <div className="flex items-center gap-2">
                        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '93%' }} />
                        </div>
                        <span className="text-sm font-medium">93%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Grade 10-A</p>
                      <div className="flex items-center gap-2">
                        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '92%' }} />
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Grade 10-B</p>
                      <div className="flex items-center gap-2">
                        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-yellow-500 h-full rounded-full" style={{ width: '87%' }} />
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Grade 11-A</p>
                      <div className="flex items-center gap-2">
                        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{ width: '95%' }} />
                        </div>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AttendanceManagement;
