
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const assignments = [
  {
    id: 1,
    subject: 'Mathematics',
    title: 'Quadratic Equations Problem Set',
    dueDate: '2025-05-28',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 2,
    subject: 'Science',
    title: 'Lab Report: Photosynthesis Experiment',
    dueDate: '2025-05-30',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 3,
    subject: 'English',
    title: 'Essay: Analysis of Shakespeare\'s Macbeth',
    dueDate: '2025-06-05',
    status: 'pending',
    priority: 'low'
  },
  {
    id: 4,
    subject: 'History',
    title: 'Research Paper: Industrial Revolution',
    dueDate: '2025-06-10',
    status: 'pending',
    priority: 'medium'
  }
];

export function UpcomingAssignments() {
  const handleViewAll = () => {
    toast.info("Viewing all assignments");
  };

  const handleSubmitAssignment = (id: number) => {
    toast.success(`Submitting assignment #${id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Assignments</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1" onClick={handleViewAll}>
          View All <ArrowUpRight size={14} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div 
              key={assignment.id} 
              className="flex items-start justify-between border-b pb-4 last:border-0"
            >
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <h4 className="font-medium">{assignment.subject}</h4>
                  <Badge 
                    className={`
                      ${assignment.priority === 'high' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                      ${assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                      ${assignment.priority === 'low' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                    `}
                  >
                    {assignment.priority}
                  </Badge>
                </div>
                <p className="text-sm mt-1">{assignment.title}</p>
                <p className="text-xs text-muted-foreground mt-1">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleSubmitAssignment(assignment.id)}
              >
                Submit
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
