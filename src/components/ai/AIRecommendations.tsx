
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Building,
  Clock,
  Brain,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { GroqAIService } from '@/services/groqAI';
import { SchoolDataService } from '@/services/schoolDataService';

export const AIRecommendations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      
      toast({
        title: "🧠 Generating AI Recommendations",
        description: "Analyzing school data for optimization opportunities...",
      });

      const schoolData = await SchoolDataService.getCompleteSchoolDataForAI();
      if (!schoolData) {
        throw new Error('Failed to fetch school data');
      }

      const result = await GroqAIService.generateSchoolRecommendations(schoolData);
      setRecommendations(result);

      toast({
        title: "✅ Recommendations Generated",
        description: `${result.priority_recommendations?.length || 0} actionable insights generated`,
      });

    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "❌ Generation Failed",
        description: "Unable to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'resource management':
        return <Building className="h-4 w-4" />;
      case 'teacher optimization':
        return <Users className="h-4 w-4" />;
      case 'scheduling':
        return <Clock className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (loading && !recommendations) {
    return (
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
            AI School Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Lightbulb className="h-8 w-8 text-purple-600 animate-pulse mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Generating intelligent recommendations...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI School Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Intelligent recommendations for school optimization and improvement
              </p>
              {recommendations && (
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    Optimization Score: {recommendations.optimization_score}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-blue-600" />
                    {recommendations.priority_recommendations?.length || 0} Recommendations
                  </span>
                </div>
              )}
            </div>
            <Button 
              onClick={generateRecommendations} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? "Generating..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {recommendations && (
        <>
          {recommendations.priority_recommendations && recommendations.priority_recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Priority Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.priority_recommendations.map((rec: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(rec.category)}
                          <span className="font-medium">{rec.category}</span>
                        </div>
                        <Badge variant={getPriorityColor(rec.priority)}>
                          {getPriorityIcon(rec.priority)}
                          {rec.priority} Priority
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg">{rec.recommendation}</h4>
                        {rec.expected_impact && (
                          <p className="text-sm text-green-700 bg-green-50 p-2 rounded mt-2">
                            <strong>Expected Impact:</strong> {rec.expected_impact}
                          </p>
                        )}
                      </div>

                      {rec.implementation_steps && rec.implementation_steps.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            Implementation Steps:
                          </h5>
                          <div className="space-y-1">
                            {rec.implementation_steps.map((step: string, stepIndex: number) => (
                              <div key={stepIndex} className="flex items-start gap-2 text-sm">
                                <Badge variant="outline" className="text-xs min-w-fit">
                                  {stepIndex + 1}
                                </Badge>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {recommendations.areas_for_improvement && recommendations.areas_for_improvement.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {recommendations.areas_for_improvement.map((area: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{area}</span>
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
