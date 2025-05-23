
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BookOpen, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentProfileProps {
  student: {
    name: string;
    id: string;
    grade: string;
    division: string;
    attendance: number;
  };
}

export function StudentProfile({ student }: StudentProfileProps) {
  const handleViewDetails = () => {
    toast.info("Viewing student details");
  };

  const handleContactTeacher = () => {
    toast.info("Opening contact form for teacher communication");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-school-100">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg bg-school-100 text-school-800">
              {student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold">{student.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">Student ID: {student.id}</Badge>
                  <Badge variant="outline" className="text-xs">Grade {student.grade}-{student.division}</Badge>
                  <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/assignments">
                      <BookOpen className="mr-1 h-4 w-4" /> Assignments
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/attendance">
                      <Calendar className="mr-1 h-4 w-4" /> Attendance
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex mt-2 md:mt-0 gap-2">
                <Button variant="outline" size="sm" onClick={handleContactTeacher}>
                  Contact Teacher
                </Button>
                <Button size="sm" onClick={handleViewDetails}>
                  View Details
                </Button>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Term Progress</span>
                  <span className="text-xs text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Learning Progress</span>
                  <span className="text-xs text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
