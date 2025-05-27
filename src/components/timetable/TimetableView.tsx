
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, BookOpen, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TimetableEntry {
  id: string;
  day_of_week: string;
  period_number: number;
  room_number: string;
  classes: { id: string; name: string; grade: string; section: string };
  teachers: { id: string; first_name: string; last_name: string };
  subjects: { id: string; name: string; code: string };
  time_slots: { id: string; name: string; start_time: string; end_time: string };
}

export function TimetableView() {
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'class' | 'teacher'>('class');

  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 7 }, (_, i) => i + 1);

  useEffect(() => {
    fetchTimetableData();

    // Set up realtime subscription
    const channel = supabase
      .channel('timetable-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timetables'
        },
        () => {
          console.log('Timetable data changed, refetching...');
          fetchTimetableData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTimetableData = async () => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .select(`
          id, day_of_week, period_number, room_number,
          classes (id, name, grade, section),
          teachers (id, first_name, last_name),
          subjects (id, name, code),
          time_slots (id, name, start_time, end_time)
        `)
        .order('day_of_week')
        .order('period_number');

      if (error) {
        console.error('Error fetching timetable:', error);
        return;
      }

      setTimetableData(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimetableEntry = (day: string, period: number, entityId?: string) => {
    if (selectedView === 'class') {
      return timetableData.find(
        entry => entry.day_of_week === day && 
                entry.period_number === period && 
                entry.classes?.id === entityId
      );
    } else {
      return timetableData.find(
        entry => entry.day_of_week === day && 
                entry.period_number === period && 
                entry.teachers?.id === entityId
      );
    }
  };

  const getUniqueEntities = () => {
    if (selectedView === 'class') {
      const classes = timetableData
        .map(entry => entry.classes)
        .filter((cls, index, self) => cls && self.findIndex(c => c?.id === cls.id) === index);
      return classes;
    } else {
      const teachers = timetableData
        .map(entry => entry.teachers)
        .filter((teacher, index, self) => teacher && self.findIndex(t => t?.id === teacher.id) === index);
      return teachers;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading timetable...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Timetable
          </CardTitle>
          <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as 'class' | 'teacher')}>
            <TabsList>
              <TabsTrigger value="class">Class View</TabsTrigger>
              <TabsTrigger value="teacher">Teacher View</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {getUniqueEntities().map((entity: any) => (
              <Card key={entity?.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {selectedView === 'class' 
                      ? `${entity?.name} - Grade ${entity?.grade} ${entity?.section}`
                      : `${entity?.first_name} ${entity?.last_name}`
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Period</th>
                          {workingDays.map(day => (
                            <th key={day} className="text-left p-2 font-medium min-w-[150px]">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map(period => (
                          <tr key={period} className="border-b">
                            <td className="p-2 font-medium bg-gray-50">{period}</td>
                            {workingDays.map(day => {
                              const entry = getTimetableEntry(day, period, entity?.id);
                              return (
                                <td key={`${day}-${period}`} className="p-2 border-l">
                                  {entry ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="h-3 w-3 text-blue-600" />
                                        <span className="text-sm font-medium">
                                          {entry.subjects?.name || 'No Subject'}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {selectedView === 'class' ? (
                                          <>
                                            <Users className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-gray-600">
                                              {entry.teachers?.first_name} {entry.teachers?.last_name}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <Users className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-gray-600">
                                              {entry.classes?.name}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      {entry.room_number && (
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3 text-purple-600" />
                                          <span className="text-xs text-gray-600">
                                            {entry.room_number}
                                          </span>
                                        </div>
                                      )}
                                      <Badge variant="outline" className="text-xs">
                                        {entry.time_slots?.start_time} - {entry.time_slots?.end_time}
                                      </Badge>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-400">Free</div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
