
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2, GraduationCap, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Badge } from '@/components/ui/badge';

// Mock data
const mockStudents = [
  { id: 1, name: "Alex Johnson", rollNo: "10A01", grade: "10", division: "A", attendance: 95, performance: "Excellent" },
  { id: 2, name: "Emily Chen", rollNo: "10A02", grade: "10", division: "A", attendance: 89, performance: "Good" },
  { id: 3, name: "Michael Davis", rollNo: "10B01", grade: "10", division: "B", attendance: 92, performance: "Good" },
  { id: 4, name: "Sophia Lee", rollNo: "11A01", grade: "11", division: "A", attendance: 98, performance: "Excellent" },
  { id: 5, name: "Ryan Smith", rollNo: "9C01", grade: "9", division: "C", attendance: 85, performance: "Average" },
  { id: 6, name: "Isabella Garcia", rollNo: "12A01", grade: "12", division: "A", attendance: 97, performance: "Excellent" },
  { id: 7, name: "Jason Wilson", rollNo: "11B01", grade: "11", division: "B", attendance: 90, performance: "Good" },
  { id: 8, name: "Olivia Brown", rollNo: "9A01", grade: "9", division: "A", attendance: 93, performance: "Good" },
];

const mockGradesAndDivisions = [
  { grade: "9", divisions: ["A", "B", "C", "D"] },
  { grade: "10", divisions: ["A", "B", "C", "D"] },
  { grade: "11", divisions: ["A", "B", "C"] },
  { grade: "12", divisions: ["A", "B"] },
];

const performanceLevels = ["Excellent", "Good", "Average", "Need Improvement"];

const StudentManagement = () => {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentGrade, setCurrentGrade] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    grade: '',
    division: '',
    attendance: 90,
    performance: 'Good'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = () => {
    const newStudent = {
      id: students.length + 1,
      ...formData
    };
    
    setStudents([...students, newStudent]);
    setFormData({
      name: '',
      rollNo: '',
      grade: '',
      division: '',
      attendance: 90,
      performance: 'Good'
    });
    setIsAddDialogOpen(false);
    toast.success(`Student ${formData.name} has been added.`);
  };

  const handleEditStudent = () => {
    const updatedStudents = students.map(student =>
      student.id === currentStudent.id ? { ...student, ...formData } : student
    );
    
    setStudents(updatedStudents);
    setIsEditDialogOpen(false);
    toast.success(`Student ${formData.name} has been updated.`);
  };

  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    toast.success("Student has been removed.");
  };

  const openEditDialog = (student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      grade: student.grade,
      division: student.division,
      attendance: student.attendance,
      performance: student.performance
    });
    setIsEditDialogOpen(true);
  };

  const handleBulkUpload = () => {
    toast.success("Bulk student data uploaded successfully.");
    setIsUploadDialogOpen(false);
  };

  const handleExportData = () => {
    toast.success("Student data exported successfully.");
  };

  // Filter students based on search and grade filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = currentGrade === 'all' || student.grade === currentGrade;
    
    return matchesSearch && matchesGrade;
  });

  const getPerformanceBadge = (performance) => {
    switch (performance) {
      case 'Excellent': return <Badge className="bg-green-500">Excellent</Badge>;
      case 'Good': return <Badge className="bg-blue-500">Good</Badge>;
      case 'Average': return <Badge className="bg-yellow-500">Average</Badge>;
      case 'Need Improvement': return <Badge className="bg-red-500">Need Improvement</Badge>;
      default: return <Badge>{performance}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
            <p className="text-muted-foreground">
              Add, edit, and manage student records.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new student.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Alex Johnson"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Select 
                        name="grade" 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value, division: '' }))}>
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
                    <div className="grid gap-2">
                      <Label htmlFor="division">Division</Label>
                      <Select 
                        name="division" 
                        disabled={!formData.grade}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, division: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.grade && mockGradesAndDivisions
                            .find(item => item.grade === formData.grade)?.divisions
                            .map(division => (
                              <SelectItem key={division} value={division}>{division}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rollNo">Roll Number</Label>
                    <Input
                      id="rollNo"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      placeholder="10A01"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="performance">Performance</Label>
                    <Select 
                      name="performance" 
                      defaultValue="Good"
                      onValueChange={(value) => setFormData(prev => ({ ...prev, performance: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select performance level" />
                      </SelectTrigger>
                      <SelectContent>
                        {performanceLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddStudent}>Add Student</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Student Data</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or Excel file with student information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Upload File</Label>
                    <Input type="file" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>File must contain the following columns:</p>
                    <ul className="list-disc ml-5 mt-2">
                      <li>Name</li>
                      <li>Grade</li>
                      <li>Division</li>
                      <li>Roll Number</li>
                      <li>Performance (optional)</li>
                      <li>Attendance % (optional)</li>
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleBulkUpload}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          
          <Select defaultValue="all" onValueChange={setCurrentGrade}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {mockGradesAndDivisions.map(item => (
                <SelectItem key={item.grade} value={item.grade}>Grade {item.grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="excellent">Excellent Performers</TabsTrigger>
            <TabsTrigger value="attendance">Attendance Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.division}</TableCell>
                        <TableCell>{student.attendance}%</TableCell>
                        <TableCell>{getPerformanceBadge(student.performance)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => openEditDialog(student)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteStudent(student.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="excellent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Excellent Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents
                      .filter(student => student.performance === "Excellent")
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.rollNo}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{student.division}</TableCell>
                          <TableCell>{student.attendance}%</TableCell>
                          <TableCell>{getPerformanceBadge(student.performance)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents
                      .filter(student => student.attendance < 90)
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.rollNo}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{student.division}</TableCell>
                          <TableCell className="text-red-500 font-semibold">{student.attendance}%</TableCell>
                          <TableCell>{getPerformanceBadge(student.performance)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-grade">Grade</Label>
                <Select 
                  name="grade" 
                  defaultValue={formData.grade}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
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
              <div className="grid gap-2">
                <Label htmlFor="edit-division">Division</Label>
                <Select 
                  name="division" 
                  defaultValue={formData.division}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, division: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGradesAndDivisions
                      .find(item => item.grade === formData.grade)?.divisions
                      .map(division => (
                        <SelectItem key={division} value={division}>{division}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rollNo">Roll Number</Label>
              <Input
                id="edit-rollNo"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-attendance">Attendance (%)</Label>
              <Input
                id="edit-attendance"
                name="attendance"
                type="number"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-performance">Performance</Label>
              <Select 
                name="performance" 
                defaultValue={formData.performance}
                onValueChange={(value) => setFormData(prev => ({ ...prev, performance: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select performance level" />
                </SelectTrigger>
                <SelectContent>
                  {performanceLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default StudentManagement;
