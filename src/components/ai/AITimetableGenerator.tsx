
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Brain, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { GroqAIService } from '@/services/groqAI';
import { SchoolDataService } from '@/services/schoolDataService';

interface TimetableGeneratorProps {
  onTimetableGenerated?: (timetable: any) => void;
}

export const AITimetableGenerator: React.FC<TimetableGeneratorProps> = ({ onTimetableGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedTimetable, setGeneratedTimetable] = useState<any>(null);
  const [optimizationScore, setOptimizationScore] = useState<number | null>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const generateTimetable = async () => {
    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      toast({
        title: "🤖 AI Timetable Generation Started",
        description: "Fetching school data and analyzing optimal schedules...",
      });

      // Simulate progress updates
      setGenerationProgress(20);
      
      // Fetch complete school data
      const schoolData = await SchoolDataService.getCompleteSchoolDataForAI();
      setGenerationProgress(40);

      if (!schoolData) {
        throw new Error('Failed to fetch school data');
      }

      toast({
        title: "📊 Analyzing School Data",
        description: `Processing ${schoolData.teachers?.length || 0} teachers, ${schoolData.classes?.length || 0} classes, and ${schoolData.subjects?.length || 0} subjects...`,
      });

      setGenerationProgress(60);

      // Generate timetable using Groq AI
      const result = await GroqAIService.generateOptimalTimetable(schoolData);
      setGenerationProgress(80);

      setGeneratedTimetable(result.timetable);
      setOptimizationScore(result.optimization_score);
      setConflicts(result.conflicts || []);
      setRecommendations(result.recommendations || []);
      
      setGenerationProgress(100);

      toast({
        title: "✅ Timetable Generated Successfully!",
        description: `Optimization Score: ${result.optimization_score}% | Conflicts: ${result.conflicts?.length || 0}`,
      });

      if (onTimetableGenerated) {
        onTimetableGenerated(result);
      }

    } catch (error) {
      console.error('Error generating timetable:', error);
      toast({
        title: "❌ Generation Failed",
        description: "Unable to generate timetable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Timetable Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Generate optimal weekly schedules using advanced AI algorithms
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium">Powered by Llama-3.3-70B</span>
              </div>
            </div>
            <Button 
              onClick={generateTimetable} 
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Generate AI Timetable
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generation Progress</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {optimizationScore !== null && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{optimizationScore}%</div>
              <Badge variant={optimizationScore >= 90 ? "default" : optimizationScore >= 75 ? "secondary" : "destructive"}>
                {optimizationScore >= 90 ? "Excellent" : optimizationScore >= 75 ? "Good" : "Needs Improvement"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conflicts Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{conflicts.length}</div>
              <div className="flex items-center gap-1">
                {conflicts.length === 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-muted-foreground">
                  {conflicts.length === 0 ? "Conflict-free" : "Needs resolution"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{recommendations.length}</div>
              <div className="text-sm text-muted-foreground">
                AI suggestions available
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {generatedTimetable && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Timetable Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Showing optimized schedule for all classes and teachers
            </div>
            <div className="space-y-4">
              {Object.entries(generatedTimetable).map(([day, periods]: [string, any]) => (
                <div key={day} className="border rounded-lg p-3">
                  <h4 className="font-semibold text-lg mb-2">{day}</h4>
                  <div className="grid gap-2">
                    {periods.slice(0, 3).map((period: any, index: number) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{period.time_slot}</span> - 
                        {period.assignments?.length > 0 ? (
                          <span className="ml-2">
                            {period.assignments[0].subject} ({period.assignments[0].class})
                          </span>
                        ) : (
                          <span className="ml-2 text-muted-foreground">Free Period</span>
                        )}
                      </div>
                    ))}
                    {periods.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{periods.length - 3} more periods...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
