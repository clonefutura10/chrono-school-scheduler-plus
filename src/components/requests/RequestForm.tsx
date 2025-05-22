
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export function RequestForm() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // In a real application, these would come from an API
  const grades = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  const divisions = ['A', 'B', 'C', 'D'];
  const timeSlots = [
    '8:00 - 8:40',
    '8:45 - 9:25',
    '9:30 - 10:10',
    '10:30 - 11:10',
    '11:15 - 11:55',
    '12:00 - 12:40',
    '1:20 - 2:00',
  ];
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Request Timetable Change</CardTitle>
        <CardDescription>
          Fill out this form to request a change to the timetable. Changes will need approval from administration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Grades</SelectLabel>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              <Select>
                <SelectTrigger id="division">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Divisions</SelectLabel>
                    {divisions.map((division) => (
                      <SelectItem key={division} value={division}>
                        Division {division}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Mathematics" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input id="room" placeholder="e.g., Room 101" />
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time-slot">Time Slot</Label>
              <Select>
                <SelectTrigger id="time-slot">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Time Slots</SelectLabel>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Change</Label>
            <Textarea 
              id="reason" 
              placeholder="Please provide details about why this change is needed..."
              rows={4}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Submit Request</Button>
      </CardFooter>
    </Card>
  );
}
