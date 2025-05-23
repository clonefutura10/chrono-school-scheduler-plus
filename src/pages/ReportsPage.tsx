
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { BarChart, FileText, Download, PieChart, ArrowDownToLine, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

// Mock data
const attendanceData = [
  { grade: '9A', attendance: 95 },
  { grade: '9B', attendance: 92 },
  { grade: '10A', attendance: 97 },
  { grade: '10B', attendance: 91 },
  { grade: '11A', attendance: 94 },
  { grade: '11B', attendance: 89 },
  { grade: '12A', attendance: 96 },
  { grade: '12B', attendance: 93 },
];

const performanceData = [
  { grade: '9A', excellent: 15, good: 10, average: 5, poor: 2 },
  { grade: '9B', excellent: 12, good: 12, average: 6, poor: 3 },
  { grade: '10A', excellent: 18, good: 8, average: 4, poor: 1 },
  { grade: '10B', excellent: 10, good: 15, average: 7, poor: 2 },
  { grade: '11A', excellent: 14, good: 9, average: 6, poor: 1 },
  { grade: '11B', excellent: 9, good: 12, average: 8, poor: 3 },
];

const subjectPerformanceData = [
  { subject: 'Mathematics', excellent: 40, good: 30, average: 20, poor: 10 },
  { subject: 'Science', excellent: 45, good: 35, average: 15, poor: 5 },
  { subject: 'English', excellent: 50, good: 25, average: 15, poor: 10 },
  { subject: 'History', excellent: 35, good: 40, average: 20, poor: 5 },
  { subject: 'Geography', excellent: 30, good: 45, average: 20, poor: 5 },
];

const teacherPerformanceData = [
  { name: 'John Smith', rating: 4.8, subjects: 'Mathematics' },
  { name: 'Sarah Johnson', rating: 4.5, subjects: 'English' },
  { name: 'Michael Brown', rating: 4.7, subjects: 'Physics' },
  { name: 'Jessica Lee', rating: 4.9, subjects: 'Chemistry' },
  { name: 'David Wilson', rating: 4.6, subjects: 'History' },
];

const COLORS = ['#4f46e5', '#3b82f6', '#0ea5e9', '#14b8a6'];

const ReportsPage = () => {
  const [reportPeriod, setReportPeriod] = useState('term');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = (reportType) => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast.success(`${reportType} report generated successfully`);
    }, 1500);
  };

  const handleExportData = (format) => {
    toast.success(`Data exported in ${format} format successfully`);
  };

  // Transform data for pie chart
  const overallPerformanceData = [
    { name: 'Excellent', value: 40 },
    { name: 'Good', value: 35 },
    { name: 'Average', value: 18 },
    { name: 'Need Improvement', value: 7 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
            <p className="text-muted-foreground">
              Generate and analyze various school reports.
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="term">This Term</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last term
              </p>
              <Button 
                variant="ghost" 
                className="w-full mt-4" 
                onClick={() => handleGenerateReport('Student')}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Attendance
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93.8%</div>
              <p className="text-xs text-muted-foreground">
                +1.2% from last term
              </p>
              <Button 
                variant="ghost" 
                className="w-full mt-4" 
                onClick={() => handleGenerateReport('Attendance')}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Performance Index
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86.3%</div>
              <p className="text-xs text-muted-foreground">
                +3.1% from last term
              </p>
              <Button 
                variant="ghost" 
                className="w-full mt-4" 
                onClick={() => handleGenerateReport('Performance')}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Student Performance</TabsTrigger>
            <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            <TabsTrigger value="teachers">Teacher Evaluation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Class Attendance Report</CardTitle>
                <CardDescription>
                  Attendance percentage by class for {reportPeriod === 'term' ? 'this term' : 
                  reportPeriod === 'month' ? 'this month' : 
                  reportPeriod === 'week' ? 'this week' : 'this year'}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Bar dataKey="attendance" fill="#4f46e5" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleExportData('PDF')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExportData('Excel')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Student Performance</CardTitle>
                  <CardDescription>
                    Distribution of performance categories across all students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={overallPerformanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {overallPerformanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Class-wise Performance</CardTitle>
                  <CardDescription>
                    Performance breakdown by class.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="excellent" name="Excellent" stackId="a" fill="#4f46e5" />
                        <Bar dataKey="good" name="Good" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="average" name="Average" stackId="a" fill="#0ea5e9" />
                        <Bar dataKey="poor" name="Need Improvement" stackId="a" fill="#f43f5e" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleGenerateReport('Detailed Performance')}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Detailed Report
                  </>
                )}
              </Button>
              <Button onClick={() => handleExportData('Excel')}>
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Analysis</CardTitle>
                <CardDescription>
                  Performance breakdown by subject across all grades.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={subjectPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="excellent" name="Excellent" stackId="a" fill="#4f46e5" />
                      <Bar dataKey="good" name="Good" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="average" name="Average" stackId="a" fill="#0ea5e9" />
                      <Bar dataKey="poor" name="Need Improvement" stackId="a" fill="#f43f5e" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleExportData('PDF')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExportData('Excel')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Evaluation Report</CardTitle>
                <CardDescription>
                  Performance ratings for teachers based on student feedback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left">Teacher Name</th>
                        <th className="py-3 px-4 text-left">Subject</th>
                        <th className="py-3 px-4 text-left">Rating</th>
                        <th className="py-3 px-4 text-left">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherPerformanceData.map((teacher, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-3 px-4">{teacher.name}</td>
                          <td className="py-3 px-4">{teacher.subjects}</td>
                          <td className="py-3 px-4">{teacher.rating}/5.0</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="bg-blue-600 h-full rounded-full" 
                                  style={{ width: `${(teacher.rating / 5) * 100}%` }} 
                                />
                              </div>
                              <span className="text-sm">
                                {teacher.rating >= 4.8 ? 'Excellent' : 
                                 teacher.rating >= 4.5 ? 'Very Good' : 'Good'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-6 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateReport('Teacher Evaluation')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Detailed Report
                  </Button>
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
