
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// Sample data for timetable change requests
const sampleRequests = [
  {
    id: 1,
    teacherName: 'Mr. Johnson',
    subject: 'Mathematics',
    grade: '10',
    division: 'A',
    date: new Date(2025, 4, 25),
    timeSlot: '8:00 - 8:40',
    reason: 'Need to reschedule due to staff meeting',
    status: 'pending',
  },
  {
    id: 2,
    teacherName: 'Ms. Parker',
    subject: 'Science',
    grade: '9',
    division: 'B',
    date: new Date(2025, 4, 26),
    timeSlot: '10:30 - 11:10',
    reason: 'Lab equipment maintenance',
    status: 'approved',
  },
  {
    id: 3,
    teacherName: 'Mrs. Williams',
    subject: 'English',
    grade: '8',
    division: 'C',
    date: new Date(2025, 4, 27),
    timeSlot: '1:20 - 2:00',
    reason: 'Department meeting conflict',
    status: 'rejected',
  },
  {
    id: 4,
    teacherName: 'Mr. Davis',
    subject: 'History',
    grade: '7',
    division: 'D',
    date: new Date(2025, 4, 28),
    timeSlot: '9:30 - 10:10',
    reason: 'Professional development workshop',
    status: 'pending',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface RequestsListProps {
  showActions?: boolean;
}

export function RequestsList({ showActions = false }: RequestsListProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Timetable Change Requests</CardTitle>
        <CardDescription>
          View and manage all pending and processed timetable change requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Grade & Division</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.teacherName}</TableCell>
                <TableCell>{request.subject}</TableCell>
                <TableCell>Grade {request.grade}-{request.division}</TableCell>
                <TableCell>{format(request.date, 'MMM dd, yyyy')}</TableCell>
                <TableCell>{request.timeSlot}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                {showActions && (
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardFooter>
    </Card>
  );
}
