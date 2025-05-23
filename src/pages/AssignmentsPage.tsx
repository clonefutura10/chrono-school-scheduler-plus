import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Upload, Check, Clock, AlertTriangle, Filter, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format, parseISO, isAfter } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define assignment type to ensure proper typing
type Assignment = {
  id: number;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  grade: string | null;
};

// Mock data for assignments
const mockAssignments: Assignment[] = [
  { 
    id: 1, 
    title: "Mathematics - Linear Equations", 
    subject: "Mathematics",
    description: "Complete exercises 3.1-3.5 from the textbook",
    dueDate: "2025-05-28",
    status: "pending",
    grade: null
  },
  { 
    id: 2, 
    title: "English Essay - Shakespeare", 
    subject: "English",
    description: "Write a 500-word essay on the themes in Hamlet",
    dueDate: "2025-05-30", 
    status: "pending",
    grade: null
  },
  { 
    id: 3, 
    title: "Science Lab Report", 
    subject: "Science",
    description: "Complete lab report for the photosynthesis experiment",
    dueDate: "2025-06-05", 
    status: "pending",
    grade: null
  },
  { 
    id: 4, 
    title: "History Research Paper", 
    subject: "History",
    description: "2000-word research paper on World War II",
    dueDate: "2025-06-10", 
    status: "pending",
    grade: null
  },
  { 
    id: 5, 
    title: "Programming Assignment - Loops", 
    subject: "Computer Science",
    description: "Create programs demonstrating various loop structures",
    dueDate: "2025-05-25", 
    status: "completed",
    grade: "A"
  },
  { 
    id: 6, 
    title: "Art Portfolio", 
    subject: "Art",
    description: "Submit your portfolio with 5 different art styles",
    dueDate: "2025-05-20", 
    status: "completed",
    grade: "A-"
  },
  { 
    id: 7, 
    title: "Geography Map Quiz", 
    subject: "Geography",
    description: "Study for the map quiz on European countries",
    dueDate: "2025-05-15", 
    status: "completed",
    grade: "B+"
  },
  { 
    id: 8, 
    title: "Music Composition", 
    subject: "Music",
    description: "Create a short musical piece using the techniques learned",
    dueDate: "2025-05-12", 
    status: "completed",
    grade: "A"
  },
];

// Helper function to get status badge color
const getStatusBadge = (status: string, dueDate: string) => {
  if (status === 'completed') {
    return <Badge className="bg-green-500">Completed</Badge>;
  }
  
  const today = new Date();
  const due = parseISO(dueDate);
  
  if (isAfter(today, due)) {
    return <Badge className="bg-red-500">Overdue</Badge>;
  }
  
  // If due within 3 days
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  if (isAfter(threeDaysFromNow, due)) {
    return <Badge className="bg-yellow-500">Due Soon</Badge>;
  }
  
  return <Badge className="bg-blue-500">Pending</Badge>;
};

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  // Calculate completion stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const completionPercentage = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
  
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const completedAssignmentsList = assignments.filter(a => a.status === 'completed');
  
  // Filter assignments based on search and subject
  const filteredPendingAssignments = pendingAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });

  const filteredCompletedAssignments = completedAssignmentsList.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });
  
  // Get unique subjects
  const subjects = Array.from(new Set(assignments.map(a => a.subject)));
  
  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsViewDialogOpen(true);
  };
  
  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitDialogOpen(true);
  };
  
  const handleCompleteSubmission = () => {
    if (!selectedAssignment) return;
    
    const updatedAssignments = assignments.map(a => 
      a.id === selectedAssignment.id ? { ...a, status: 'completed', grade: 'Pending' } : a
    );
    
    setAssignments(updatedAssignments);
    setIsSubmitDialogOpen(false);
    toast.success("Assignment submitted successfully!");
  };

  // Custom sort function for assignments with proper typing
  const sortAssignments = (a: Assignment, b: Assignment): number => {
    // First sort by status (pending comes first)
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // Then sort by date - using Number() to explicitly convert to number type
    return Number(new Date(a.dueDate)) - Number(new Date(b.dueDate));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Assignments</h2>
            <p className="text-muted-foreground">
              Track and manage your school assignments.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <CalendarClock className="mr-2 h-4 w-4" />
              Assignment Calendar
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progress</CardTitle>
              <CardDescription>Your overall assignment completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <Progress value={completionPercentage} className="h-2" />
                  <span className="text-sm font-medium">{completionPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    <span>Completed: {completedAssignments}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Pending: {totalAssignments - completedAssignments}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Total: {totalAssignments}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Due Dates</CardTitle>
              <CardDescription>Assignments due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingAssignments
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .slice(0, 3)
                  .map(assignment => (
                    <div key={assignment.id} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <div className="font-medium">{assignment.title.split(' - ')[1]}</div>
                        <div className="text-sm text-muted-foreground">{assignment.subject}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{format(parseISO(assignment.dueDate), 'MMM d')}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Your recently graded work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedAssignmentsList
                  .filter(a => a.grade !== null && a.grade !== 'Pending')
                  .slice(0, 3)
                  .map(assignment => (
                    <div key={assignment.id} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <div className="font-medium">{assignment.title.split(' - ')[1]}</div>
                        <div className="text-sm text-muted-foreground">{assignment.subject}</div>
                      </div>
                      <div>
                        <Badge>{assignment.grade}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedAssignmentsList.length})</TabsTrigger>
            <TabsTrigger value="all">All Assignments ({assignments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPendingAssignments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-8 w-8 mb-2" />
                    <p>No pending assignments found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPendingAssignments.map(assignment => (
                      <div key={assignment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                        <div className="flex flex-col space-y-1 mb-2 md:mb-0">
                          <div className="font-medium">{assignment.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{assignment.subject}</Badge>
                            <span className="text-sm text-muted-foreground">Due: {format(parseISO(assignment.dueDate), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          {getStatusBadge(assignment.status, assignment.dueDate)}
                          <Button variant="outline" size="sm" onClick={() => handleViewAssignment(assignment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button size="sm" onClick={() => handleSubmitAssignment(assignment)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredCompletedAssignments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Check className="mx-auto h-8 w-8 mb-2" />
                    <p>No completed assignments found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCompletedAssignments.map(assignment => (
                      <div key={assignment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                        <div className="flex flex-col space-y-1 mb-2 md:mb-0">
                          <div className="font-medium">{assignment.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{assignment.subject}</Badge>
                            <span className="text-sm text-muted-foreground">Submitted: {format(parseISO(assignment.dueDate), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <Badge className="bg-green-500">Completed</Badge>
                          {assignment.grade && (
                            <Badge className={assignment.grade === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}>
                              {assignment.grade === 'Pending' ? 'Grade Pending' : `Grade: ${assignment.grade}`}
                            </Badge>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleViewAssignment(assignment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments
                    .filter(assignment => {
                      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
                      
                      const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
                      
                      return matchesSearch && matchesSubject;
                    })
                    .sort(sortAssignments)
                    .map(assignment => (
                      <div key={assignment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                        <div className="flex flex-col space-y-1 mb-2 md:mb-0">
                          <div className="font-medium">{assignment.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{assignment.subject}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {assignment.status === 'pending' ? `Due: ${format(parseISO(assignment.dueDate), 'MMM d, yyyy')}` : 'Completed'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          {assignment.status === 'pending' ? 
                            getStatusBadge(assignment.status, assignment.dueDate) : 
                            <Badge className="bg-green-500">Completed</Badge>
                          }
                          
                          {assignment.grade && assignment.status === 'completed' && (
                            <Badge className={assignment.grade === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}>
                              {assignment.grade === 'Pending' ? 'Grade Pending' : `Grade: ${assignment.grade}`}
                            </Badge>
                          )}
                          
                          <Button variant="outline" size="sm" onClick={() => handleViewAssignment(assignment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          
                          {assignment.status === 'pending' && (
                            <Button size="sm" onClick={() => handleSubmitAssignment(assignment)}>
                              <Upload className="mr-2 h-4 w-4" />
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* View Assignment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
            <DialogDescription>
              Assignment Details
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Subject</div>
                  <div className="font-medium">{selectedAssignment.subject}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Due Date</div>
                  <div className="font-medium">{format(parseISO(selectedAssignment.dueDate), 'PPP')}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
                <div className="p-3 border rounded-md">
                  {selectedAssignment.description}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                <div className="flex items-center gap-2">
                  {selectedAssignment.status === 'completed' ? (
                    <>
                      <Badge className="bg-green-500">Completed</Badge>
                      {selectedAssignment.grade && (
                        <Badge className={selectedAssignment.grade === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}>
                          {selectedAssignment.grade === 'Pending' ? 'Grade Pending' : `Grade: ${selectedAssignment.grade}`}
                        </Badge>
                      )}
                    </>
                  ) : (
                    getStatusBadge(selectedAssignment.status, selectedAssignment.dueDate)
                  )}
                </div>
              </div>
              
              {selectedAssignment.status === 'pending' && (
                <div className="border-t pt-4">
                  <Button onClick={() => {
                    setIsViewDialogOpen(false);
                    handleSubmitAssignment(selectedAssignment);
                  }}>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Assignment
                  </Button>
                </div>
              )}
              
              {selectedAssignment.status === 'completed' && selectedAssignment.grade && selectedAssignment.grade !== 'Pending' && (
                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Feedback</div>
                  <div className="p-3 border rounded-md">
                    Good work! Your understanding of the concepts is clear. Keep up the good work.
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Submit Assignment Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4 py-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Upload Files</div>
                <Input type="file" />
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted file formats: PDF, DOCX, JPG, PNG (Max size: 10MB)
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Comments (Optional)</div>
                <textarea 
                  className="w-full p-3 border rounded-md"
                  placeholder="Add any comments about your submission..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded-md bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <p className="text-sm">
                  Please ensure you have completed all requirements before submitting.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCompleteSubmission}>Submit Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AssignmentsPage;
