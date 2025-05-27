
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TimetableGenerator } from '@/components/timetable/TimetableGenerator';
import { TimetableView } from '@/components/timetable/TimetableView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, BookOpen, Clock, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Index() {
  const [stats, setStats] = useState({
    teachers: 0,
    classes: 0,
    subjects: 0,
    timetableEntries: 0
  });

  useEffect(() => {
    fetchStats();

    // Set up realtime subscriptions for live updates
    const teachersChannel = supabase
      .channel('teachers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, fetchStats)
      .subscribe();

    const classesChannel = supabase
      .channel('classes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, fetchStats)
      .subscribe();

    const subjectsChannel = supabase
      .channel('subjects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subjects' }, fetchStats)
      .subscribe();

    const timetableChannel = supabase
      .channel('timetable-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'timetables' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(teachersChannel);
      supabase.removeChannel(classesChannel);
      supabase.removeChannel(subjectsChannel);
      supabase.removeChannel(timetableChannel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const [teachers, classes, subjects, timetables] = await Promise.all([
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('classes').select('id', { count: 'exact', head: true }),
        supabase.from('subjects').select('id', { count: 'exact', head: true }),
        supabase.from('timetables').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        teachers: teachers.count || 0,
        classes: classes.count || 0,
        subjects: subjects.count || 0,
        timetableEntries: timetables.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chrono School Scheduler Plus
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Intelligent timetable management system with AI-powered scheduling and real-time synchronization
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Teachers</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.teachers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Classes</p>
                  <p className="text-3xl font-bold text-green-900">{stats.classes}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Subjects</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.subjects}</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Scheduled</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.timetableEntries}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Generate Timetable
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              View Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <TimetableGenerator />
          </TabsContent>

          <TabsContent value="view">
            <TimetableView />
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🔄 Real-time Synchronization Active
              </h3>
              <p className="text-gray-600">
                This system automatically syncs with the setup portal. Any changes to teachers, classes, 
                or subjects will be reflected instantly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
