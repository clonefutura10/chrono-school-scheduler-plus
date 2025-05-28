
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function RealtimeTimetableSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [dataCount, setDataCount] = useState({ teachers: 0, classes: 0, subjects: 0 });

  useEffect(() => {
    // Check initial data
    checkDataCounts();

    // Subscribe to realtime changes for key tables
    const channel = supabase
      .channel('timetable-sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'teachers'
      }, (payload) => {
        console.log('Teacher data changed:', payload);
        setLastSync(new Date().toLocaleTimeString());
        checkDataCounts();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'classes'
      }, (payload) => {
        console.log('Class data changed:', payload);
        setLastSync(new Date().toLocaleTimeString());
        checkDataCounts();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subjects'
      }, (payload) => {
        console.log('Subject data changed:', payload);
        setLastSync(new Date().toLocaleTimeString());
        checkDataCounts();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'availability'
      }, (payload) => {
        console.log('Availability data changed:', payload);
        setLastSync(new Date().toLocaleTimeString());
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'timetables'
      }, (payload) => {
        console.log('Timetable data changed:', payload);
        setLastSync(new Date().toLocaleTimeString());
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        console.log('Realtime connection status:', status);
        if (status === 'SUBSCRIBED') {
          setLastSync(new Date().toLocaleTimeString());
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkDataCounts = async () => {
    try {
      const [teachersResult, classesResult, subjectsResult] = await Promise.all([
        supabase.from('teachers').select('id', { count: 'exact' }),
        supabase.from('classes').select('id', { count: 'exact' }),
        supabase.from('subjects').select('id', { count: 'exact' })
      ]);

      setDataCount({
        teachers: teachersResult.count || 0,
        classes: classesResult.count || 0,
        subjects: subjectsResult.count || 0
      });
    } catch (error) {
      console.error('Error checking data counts:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3 mr-1" />
            Live Sync Active
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 mr-1" />
            Connecting...
          </>
        )}
      </Badge>
      {dataCount.teachers > 0 && (
        <span className="text-xs text-muted-foreground">
          {dataCount.teachers} teachers • {dataCount.classes} classes • {dataCount.subjects} subjects
        </span>
      )}
      {lastSync && (
        <span className="text-xs text-muted-foreground">
          Last update: {lastSync}
        </span>
      )}
    </div>
  );
}
