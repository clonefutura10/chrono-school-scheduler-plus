
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, BookOpen, Trophy } from 'lucide-react';

const infrastructureData = {
  totalClassrooms: 40,
  specialRooms: [
    { name: "Computer Labs", count: 2 },
    { name: "Library", count: 1 },
    { name: "Science Lab", count: 1 },
    { name: "Math Lab", count: 1 }
  ],
  playgroundAreas: ["Indoor Gym", "Outdoor Playground", "Sports Ground"],
  assemblyHall: "1 Auditorium"
};

const studentStrength = [
  { grade: "Pre-Primary", totalStudents: 120, idealClassSize: 20, divisions: 6 },
  { grade: "Class 1", totalStudents: 90, idealClassSize: 30, divisions: 3 },
  { grade: "Class 2", totalStudents: 95, idealClassSize: 30, divisions: 3 },
  { grade: "Class 3", totalStudents: 88, idealClassSize: 30, divisions: 3 },
  { grade: "Class 4", totalStudents: 92, idealClassSize: 30, divisions: 3 },
  { grade: "Class 5", totalStudents: 85, idealClassSize: 30, divisions: 3 },
  { grade: "Class 6", totalStudents: 78, idealClassSize: 30, divisions: 3 },
  { grade: "Class 7", totalStudents: 82, idealClassSize: 30, divisions: 3 },
  { grade: "Class 8", totalStudents: 75, idealClassSize: 30, divisions: 3 },
  { grade: "Class 9", totalStudents: 70, idealClassSize: 30, divisions: 2 },
  { grade: "Class 10", totalStudents: 68, idealClassSize: 30, divisions: 2 },
  { grade: "Class 11", totalStudents: 65, idealClassSize: 30, divisions: 2 },
  { grade: "Class 12", totalStudents: 60, idealClassSize: 30, divisions: 2 }
];

export function InfrastructureOverview() {
  const totalStudents = studentStrength.reduce((sum, grade) => sum + grade.totalStudents, 0);
  const totalDivisions = studentStrength.reduce((sum, grade) => sum + grade.divisions, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classrooms</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{infrastructureData.totalClassrooms}</div>
            <p className="text-xs text-muted-foreground">Active learning spaces</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across {totalDivisions} divisions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Special Rooms</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{infrastructureData.specialRooms.length + 2}</div>
            <p className="text-xs text-muted-foreground">Labs & facilities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sports Areas</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{infrastructureData.playgroundAreas.length}</div>
            <p className="text-xs text-muted-foreground">Recreation spaces</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Special Rooms</h4>
              <div className="flex flex-wrap gap-2">
                {infrastructureData.specialRooms.map((room, index) => (
                  <Badge key={index} variant="outline">
                    {room.count} {room.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Sports & Recreation</h4>
              <div className="flex flex-wrap gap-2">
                {infrastructureData.playgroundAreas.map((area, index) => (
                  <Badge key={index} variant="outline">{area}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Assembly Hall</h4>
              <Badge variant="outline">{infrastructureData.assemblyHall}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {studentStrength.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{grade.grade}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {grade.divisions} divisions
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{grade.totalStudents}</div>
                    <div className="text-xs text-muted-foreground">
                      ~{Math.round(grade.totalStudents / grade.divisions)} per class
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
