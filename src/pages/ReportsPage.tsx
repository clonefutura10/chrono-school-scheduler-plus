
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { AIPerformanceAnalytics } from '@/components/ai/AIPerformanceAnalytics';
import { AIRecommendations } from '@/components/ai/AIRecommendations';

const ReportsPage = () => {
  // Mock data for traditional reports
  const studentStats = {
    totalStudents: 1068,
    byGrade: [
      { grade: "Grade 9", count: 285, percentage: 27 },
      { grade: "Grade 10", count: 297, percentage: 28 },
      { grade: "Grade 11", count: 254, percentage: 24 },
      { grade: "Grade 12", count: 232, percentage: 22 }
    ],
    attendanceRate: 94.2,
    performanceMetrics: {
      excellent: 23,
      good: 45,
      satisfactory: 28,
      needsImprovement: 4
    }
  };

  const teacherStats = {
    totalTeachers: 58,
    byDepartment: [
      { department: "Science", count: 15, percentage: 26 },
      { department: "Mathematics", count: 12, percentage: 21 },
      { department: "Languages", count: 14, percentage: 24 },
      { department: "Social Studies", count: 10, percentage: 17 },
      { department: "Arts", count: 7, percentage: 12 }
    ],
    avgWorkload: 78,
    satisfaction: 88
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI-Enhanced Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights powered by artificial intelligence and real-time data analysis
          </p>
          <Badge className="mt-2 bg-purple-100 text-purple-800">
            <Brain className="h-3 w-3 mr-1" />
            Enhanced with AI Analytics
          </Badge>
        </div>

        <Tabs defaultValue="ai-performance" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-4">
            <TabsTrigger value="ai-performance">
              <Brain className="h-4 w-4 mr-1" />
              AI Performance
            </TabsTrigger>
            <TabsTrigger value="ai-insights">
              <Target className="h-4 w-4 mr-1" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="student-reports">Student Reports</TabsTrigger>
            <TabsTrigger value="teacher-reports">Teacher Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-performance" className="space-y-4 mt-4">
            <AIPerformanceAnalytics />
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4 mt-4">
            <AIRecommendations />
          </TabsContent>

          <TabsContent value="student-reports" className="space-y-4 mt-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Across all grades</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{studentStats.attendanceRate}%</div>
                  <Progress value={studentStats.attendanceRate} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{studentStats.performanceMetrics.excellent}%</div>
                  <p className="text-xs text-muted-foreground">Excellent grade students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Needs Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{studentStats.performanceMetrics.needsImprovement}%</div>
                  <p className="text-xs text-muted-foreground">Require intervention</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Distribution by Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentStats.byGrade.map((grade) => (
                    <div key={grade.grade} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{grade.grade}</span>
                        <span className="text-sm text-muted-foreground">
                          {grade.count} students ({grade.percentage}%)
                        </span>
                      </div>
                      <Progress value={grade.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border rounded-lg bg-green-50">
                    <div className="text-2xl font-bold text-green-600">{studentStats.performanceMetrics.excellent}%</div>
                    <div className="text-sm text-green-700">Excellent</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">{studentStats.performanceMetrics.good}%</div>
                    <div className="text-sm text-blue-700">Good</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-yellow-50">
                    <div className="text-2xl font-bold text-yellow-600">{studentStats.performanceMetrics.satisfactory}%</div>
                    <div className="text-sm text-yellow-700">Satisfactory</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-red-50">
                    <div className="text-2xl font-bold text-red-600">{studentStats.performanceMetrics.needsImprovement}%</div>
                    <div className="text-sm text-red-700">Needs Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teacher-reports" className="space-y-4 mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teacherStats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">Active faculty members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Workload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{teacherStats.avgWorkload}%</div>
                  <Progress value={teacherStats.avgWorkload} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{teacherStats.satisfaction}%</div>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-muted-foreground">High satisfaction</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Teacher Distribution by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherStats.byDepartment.map((dept) => (
                    <div key={dept.department} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{dept.department}</span>
                        <span className="text-sm text-muted-foreground">
                          {dept.count} teachers ({dept.percentage}%)
                        </span>
                      </div>
                      <Progress value={dept.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
