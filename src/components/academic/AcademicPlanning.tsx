
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Target } from 'lucide-react';

const academicStructure = {
  academicYear: { start: "June 1, 2025", end: "March 31, 2026" },
  workingDays: 220,
  terms: [
    { name: "Term 1", period: "Jun - Oct", workingDays: 110 },
    { name: "Term 2", period: "Nov - Mar", workingDays: 110 }
  ],
  examinations: [
    { type: "Unit Test 1", period: "July 15-20" },
    { type: "Mid-Term", period: "August 20-30" },
    { type: "Unit Test 2", period: "December 10-15" },
    { type: "Final Exams", period: "March 1-15" }
  ]
};

const weeklyPlanning = [
  {
    week: "June 1-7",
    prePrimary: "School Reopens, Welcome Songs",
    primary: "Orientation, Class Allotments",
    secondary: "Orientation, Time-Table Finalization"
  },
  {
    week: "June 8-14",
    prePrimary: "Rhymes & Circle Time",
    primary: "Class Rules & Club Selections",
    secondary: "Leadership Elections & Career Talks"
  },
  {
    week: "June 15-21",
    prePrimary: "Colour Day: Red",
    primary: "Storytelling Competition",
    secondary: "Career Orientation Session (XI-XII)"
  },
  {
    week: "June 22-30",
    prePrimary: "Handprint Art & Free Play",
    primary: "Drawing Competition",
    secondary: "Practical Demo: Lab Safety & Project Planning"
  }
];

const coCurricularEvents = [
  { event: "Independence Day", date: "August 15", type: "celebration" },
  { event: "Teachers' Day", date: "September 5", type: "celebration" },
  { event: "Science Fair", date: "October 20", type: "competition" },
  { event: "Annual Sports Day", date: "December 15", type: "sports" },
  { event: "Annual Day", date: "December 20", type: "celebration" },
  { event: "Science Exhibition", date: "January 15", type: "exhibition" }
];

const staffPlanning = [
  { activity: "Teacher Orientation", date: "May 25-30", participants: "All Staff" },
  { activity: "Curriculum Planning", date: "Monthly", participants: "Subject Heads" },
  { activity: "Parent-Teacher Meetings", date: "End of each term", participants: "Class Teachers" },
  { activity: "Internal Assessment", date: "Quarterly", participants: "Academic Team" }
];

export function AcademicPlanning() {
  const getEventBadgeColor = (type: string) => {
    switch(type) {
      case 'celebration': return 'bg-purple-100 text-purple-800';
      case 'competition': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'exhibition': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{academicStructure.academicYear.start}</div>
            <p className="text-xs text-muted-foreground">to {academicStructure.academicYear.end}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Days</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{academicStructure.workingDays}</div>
            <p className="text-xs text-muted-foreground">Total for the year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terms</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{academicStructure.terms.length}</div>
            <p className="text-xs text-muted-foreground">Academic terms</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coCurricularEvents.length}</div>
            <p className="text-xs text-muted-foreground">Planned events</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="structure">Academic Structure</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Planning</TabsTrigger>
          <TabsTrigger value="events">Events & Activities</TabsTrigger>
          <TabsTrigger value="staff">Staff Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="structure" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Term Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {academicStructure.terms.map((term, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{term.name}</h4>
                        <Badge variant="outline">{term.period}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {term.workingDays} working days
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Examination Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {academicStructure.examinations.map((exam, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{exam.type}</h4>
                        <Badge variant="outline">{exam.period}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Class-wise Weekly Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Week</th>
                      <th className="text-left p-3">Pre-Primary</th>
                      <th className="text-left p-3">Primary</th>
                      <th className="text-left p-3">Secondary & Higher Secondary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyPlanning.map((week, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{week.week}</td>
                        <td className="p-3">{week.prePrimary}</td>
                        <td className="p-3">{week.primary}</td>
                        <td className="p-3">{week.secondary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Co-curricular Events & Celebrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {coCurricularEvents.map((event, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{event.event}</h4>
                      <Badge className={getEventBadgeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Development & Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffPlanning.map((activity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{activity.activity}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Participants: {activity.participants}
                        </p>
                      </div>
                      <Badge variant="outline">{activity.date}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
