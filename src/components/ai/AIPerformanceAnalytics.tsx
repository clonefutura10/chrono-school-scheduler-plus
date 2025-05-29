
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  BookOpen, 
  Brain,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { GroqAIService } from '@/services/groqAI';
import { SchoolDataService } from '@/services/schoolDataService';

export const AIPerformanceAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const { toast } = useToast();

  const analyzePerformance = async () => {
    try {
      setLoading(true);
      
      toast({
        title: "🧠 AI Analysis Started",
        description: "Analyzing student performance patterns...",
      });

      const schoolData = await SchoolDataService.getCompleteSchoolDataForAI();
      if (!schoolData) {
        throw new Error('Failed to fetch school data');
      }

      const result = await GroqAIService.analyzeStudentPerformance(schoolData);
      setAnalytics(result);

      toast({
        title: "✅ Analysis Complete",
        description: `Analyzed ${schoolData.students?.length || 0} students across ${schoolData.classes?.length || 0} classes`,
      });

    } catch (error) {
      console.error('Error analyzing performance:', error);
      toast({
        title: "❌ Analysis Failed",
        description: "Unable to analyze performance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-analyze on component mount
    analyzePerformance();
  }, []);

  if (loading && !analytics) {
    return (
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-green-600 animate-pulse" />
            AI Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-green-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Analyzing student performance patterns...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-green-600" />
            AI Performance Analytics
            <Badge variant="outline" className="ml-auto">
              <Zap className="h-3 w-3 mr-1" />
              Live Analysis
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Advanced AI-powered analysis of student performance and learning patterns
            </p>
            <Button 
              onClick={analyzePerformance} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? "Analyzing..." : "Refresh Analysis"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analytics && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{analytics.overall_score}%</div>
                <Progress value={analytics.overall_score} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  At-Risk Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{analytics.at_risk_students?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Require immediate attention
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analytics.predictions?.filter((p: any) => p.predicted_grade?.includes('A')).length || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Predicted A-grade students
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  Subject Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{analytics.subject_analysis?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Subjects analyzed
                </div>
              </CardContent>
            </Card>
          </div>

          {analytics.at_risk_students && analytics.at_risk_students.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  At-Risk Students Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.at_risk_students.slice(0, 5).map((student: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 bg-red-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{student.student_name}</span>
                        <Badge variant={student.risk_level === 'High' ? 'destructive' : 'secondary'}>
                          {student.risk_level} Risk
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>Issues:</strong> {student.issues?.join(', ') || 'General performance concerns'}
                      </div>
                      <div className="text-sm">
                        <strong>Recommendations:</strong> {student.recommendations?.join(', ') || 'Schedule consultation with teachers'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analytics.class_performance && analytics.class_performance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Class Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {analytics.class_performance.map((classItem: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{classItem.class_name}</span>
                        <Badge variant={classItem.trend === 'Improving' ? 'default' : 'secondary'}>
                          {classItem.trend}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{classItem.average_score}%</div>
                      <Progress value={classItem.average_score} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analytics.predictions && analytics.predictions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  AI Grade Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3">
                  {analytics.predictions.slice(0, 9).map((prediction: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 text-center">
                      <div className="font-medium text-sm">{prediction.student_name}</div>
                      <div className="text-2xl font-bold text-purple-600 my-1">
                        {prediction.predicted_grade}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {prediction.confidence}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
