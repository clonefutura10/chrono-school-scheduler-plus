
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BookOpen, Calendar, GraduationCap, Trophy } from 'lucide-react';
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
    toast.info("Viewing detailed student profile");
  };

  const handleContactTeacher = () => {
    toast.info("Opening teacher communication portal");
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-white">
                  <GraduationCap className="mr-1 h-3 w-3" />
                  ID: {student.id}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1 bg-white">
                  Grade {student.grade}-{student.division}
                </Badge>
                <Badge className="text-sm px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200">
                  <Trophy className="mr-1 h-3 w-3" />
                  Active Student
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex-1 lg:ml-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Academic Progress</span>
                    <span className="text-sm font-bold text-blue-600">78%</span>
                  </div>
                  <Progress value={78} className="h-3 bg-gray-200" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Attendance Rate</span>
                    <span className="text-sm font-bold text-green-600">{student.attendance}%</span>
                  </div>
                  <Progress value={student.attendance} className="h-3 bg-gray-200" />
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50" asChild>
                    <Link to="/assignments">
                      <BookOpen className="mr-2 h-4 w-4" /> 
                      Assignments
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50" asChild>
                    <Link to="/attendance">
                      <Calendar className="mr-2 h-4 w-4" /> 
                      Attendance
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={handleContactTeacher} className="border-purple-200 hover:bg-purple-50">
                    Contact Teacher
                  </Button>
                  <Button size="sm" onClick={handleViewDetails} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
