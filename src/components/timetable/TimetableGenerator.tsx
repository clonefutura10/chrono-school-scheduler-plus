
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Users, BookOpen, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function TimetableGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateTimetable = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting timetable generation...');
      
      const { data, error } = await supabase.functions.invoke('generate-timetable', {
        body: {}
      });

      if (error) {
        console.error('Error generating timetable:', error);
        throw error;
      }

      console.log('Timetable generation response:', data);

      toast({
        title: "Success!",
        description: `Timetable generated successfully with ${data.entriesCount} entries`,
      });

    } catch (error) {
      console.error('Failed to generate timetable:', error);
      toast({
        title: "Error",
        description: "Failed to generate timetable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">AI Timetable Generator</CardTitle>
            <CardDescription>
              Generate intelligent timetables using Groq AI with teacher availability and constraints
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Users className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Teachers</p>
              <p className="text-sm text-green-700">With availability & subjects</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Classes</p>
              <p className="text-sm text-blue-700">With periods & schedules</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Smart Scheduling</p>
              <p className="text-sm text-purple-700">AI-powered optimization</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <Button 
            onClick={handleGenerateTimetable}
            disabled={isGenerating}
            size="lg"
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
                Generate New Timetable
              </>
            )}
          </Button>
          
          <p className="text-sm text-gray-600 mt-3 text-center">
            This will create a complete weekly schedule for all classes and teachers
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
