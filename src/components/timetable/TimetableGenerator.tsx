
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function TimetableGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { toast } = useToast();

  const generateTimetable = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-timetable');
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Timetable Generated",
          description: "School timetable has been successfully generated and saved.",
        });
        setLastGenerated(new Date().toLocaleString());
      } else {
        throw new Error(data.error || 'Failed to generate timetable');
      }
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate timetable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Smart Timetable Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Generate intelligent timetables using AI that automatically:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Maps teachers to subjects based on availability</li>
            <li>Ensures zero scheduling conflicts</li>
            <li>Balances workload across all teachers</li>
            <li>Respects teacher preferences and constraints</li>
          </ul>
        </div>
        
        {lastGenerated && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">Last Generated</Badge>
            <span className="text-sm text-muted-foreground">{lastGenerated}</span>
          </div>
        )}
        
        <Button 
          onClick={generateTimetable} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Timetable...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Generate Smart Timetable
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          Powered by Groq AI • Syncs with setup portal automatically
        </div>
      </CardContent>
    </Card>
  );
}
