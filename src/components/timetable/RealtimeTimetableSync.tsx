
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function RealtimeTimetableSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
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
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'classes'
      }, (payload) => {
        console.log('Class data changed:', payload);
        setLastSync(new Date().toLocaleTimeString());
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subjects'
      }, (payload) => {
        console.log('Subject data changed:', payload);
        setLastSync(new Date().toLocaleTimeString());
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'availability'
      }, (payload) => {
        console.log('Availability data changed:', payload);
        setLastSync(new Date().toLocaleTimeString());
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        console.log('Realtime connection status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      {lastSync && (
        <span className="text-xs text-muted-foreground">
          Last update: {lastSync}
        </span>
      )}
    </div>
  );
}
