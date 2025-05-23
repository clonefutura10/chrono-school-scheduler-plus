
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2, BookOpen, School } from 'lucide-react';
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

// Mock data
const mockTeachers = [
  { id: 1, name: "John Smith", email: "john.smith@school.edu", subject: "Mathematics", classes: "10A, 10B, 11A" },
  { id: 2, name: "Sarah Johnson", email: "sarah.johnson@school.edu", subject: "English", classes: "9A, 9B, 10C" },
  { id: 3, name: "Michael Brown", email: "michael.brown@school.edu", subject: "Physics", classes: "11A, 11B, 12A" },
  { id: 4, name: "Jessica Lee", email: "jessica.lee@school.edu", subject: "Chemistry", classes: "10A, 11A, 12B" },
  { id: 5, name: "David Wilson", email: "david.wilson@school.edu", subject: "History", classes: "9A, 10B, 11C" },
];

const mockSubjects = [
  "Mathematics", "English", "Physics", "Chemistry", "Biology", 
  "History", "Geography", "Computer Science", "Physical Education",
  "Art", "Music", "Economics"
];

const mockGradesAndDivisions = [
  { grade: "9", divisions: ["A", "B", "C", "D"] },
  { grade: "10", divisions: ["A", "B", "C", "D"] },
  { grade: "11", divisions: ["A", "B", "C"] },
  { grade: "12", divisions: ["A", "B"] },
];

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState(mockTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    classes: ''
  });
  const [assignData, setAssignData] = useState({
    teacherId: null,
    subject: '',
    grade: '',
    division: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    const newTeacher = {
      id: teachers.length + 1,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      classes: formData.classes || "Not assigned"
    };
    
    setTeachers([...teachers, newTeacher]);
    setFormData({ name: '', email: '', subject: '', classes: '' });
    setIsAddDialogOpen(false);
    toast.success(`Teacher ${formData.name} has been added.`);
  };

  const handleEditTeacher = () => {
    const updatedTeachers = teachers.map(teacher =>
      teacher.id === currentTeacher.id ? { ...teacher, ...formData } : teacher
    );
    
    setTeachers(updatedTeachers);
    setFormData({ name: '', email: '', subject: '', classes: '' });
    setIsEditDialogOpen(false);
    toast.success(`Teacher ${formData.name} has been updated.`);
  };

  const handleDeleteTeacher = (id) => {
    const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
    setTeachers(updatedTeachers);
    toast.success("Teacher has been removed.");
  };

  const openEditDialog = (teacher) => {
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      classes: teacher.classes
    });
    setIsEditDialogOpen(true);
  };

  const openAssignDialog = (teacher) => {
    setCurrentTeacher(teacher);
    setAssignData({
      teacherId: teacher.id,
      subject: teacher.subject,
      grade: '',
      division: ''
    });
    setIsAssignDialogOpen(true);
  };

  const handleAssignClasses = () => {
    const { grade, division, subject } = assignData;
    const newClass = `${grade}${division}`;
    
    const updatedTeachers = teachers.map(teacher => {
      if (teacher.id === currentTeacher.id) {
        const classes = teacher.classes === "Not assigned" ? newClass : `${teacher.classes}, ${newClass}`;
        return { ...teacher, subject, classes };
      }
      return teacher;
    });
    
    setTeachers(updatedTeachers);
    setIsAssignDialogOpen(false);
    toast.success(`Teacher ${currentTeacher.name} has been assigned to ${grade}${division} for ${subject}.`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Teacher Management</h2>
            <p className="text-muted-foreground">
              Add, edit, and assign teachers to classes and subjects.
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new teacher here.
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
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.smith@school.edu"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      name="subject"
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSubjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddTeacher}>Add Teacher</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <Input
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Teachers</TabsTrigger>
            <TabsTrigger value="math">Math Department</TabsTrigger>
            <TabsTrigger value="science">Science Department</TabsTrigger>
            <TabsTrigger value="humanities">Humanities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teacher List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>{teacher.classes}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => openEditDialog(teacher)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => openAssignDialog(teacher)}>
                              <BookOpen className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteTeacher(teacher.id)}>
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
          
          <TabsContent value="math" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Math Department</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers
                      .filter(teacher => teacher.subject === "Mathematics")
                      .map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>{teacher.classes}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => openEditDialog(teacher)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => openAssignDialog(teacher)}>
                                <BookOpen className="h-4 w-4" />
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
          
          <TabsContent value="science" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Science Department</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Classes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers
                      .filter(teacher => ["Physics", "Chemistry", "Biology"].includes(teacher.subject))
                      .map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>{teacher.subject}</TableCell>
                          <TableCell>{teacher.classes}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="humanities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Humanities Department</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Classes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers
                      .filter(teacher => ["History", "English", "Geography", "Economics"].includes(teacher.subject))
                      .map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>{teacher.subject}</TableCell>
                          <TableCell>{teacher.classes}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update the teacher's information.
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
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Select 
                name="subject" 
                defaultValue={formData.subject}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTeacher}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Classes Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Classes</DialogTitle>
            <DialogDescription>
              Assign teacher to specific grade and division.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Teacher</Label>
              <Input value={currentTeacher?.name} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assign-subject">Subject</Label>
              <Select 
                defaultValue={assignData.subject}
                onValueChange={(value) => setAssignData(prev => ({ ...prev, subject: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assign-grade">Grade</Label>
              <Select 
                onValueChange={(value) => setAssignData(prev => ({ ...prev, grade: value, division: '' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  {mockGradesAndDivisions.map(item => (
                    <SelectItem key={item.grade} value={item.grade}>{item.grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {assignData.grade && (
              <div className="grid gap-2">
                <Label htmlFor="assign-division">Division</Label>
                <Select 
                  onValueChange={(value) => setAssignData(prev => ({ ...prev, division: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a division" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGradesAndDivisions
                      .find(item => item.grade === assignData.grade)?.divisions
                      .map(division => (
                        <SelectItem key={division} value={division}>{division}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAssignClasses}
              disabled={!assignData.grade || !assignData.division || !assignData.subject}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default TeacherManagement;
