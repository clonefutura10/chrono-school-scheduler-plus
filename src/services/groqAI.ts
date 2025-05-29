
// Groq AI Service for School Management System
const GROQ_API_KEY = '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';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface TimetableGeneration {
  timetable: {
    [day: string]: Array<{
      time_slot: string;
      period: number;
      assignments: Array<{
        class: string;
        subject: string;
        teacher: string;
        room: string;
      }>;
    }>;
  };
  conflicts: any[];
  optimization_score: number;
  recommendations: string[];
}

interface PerformanceAnalysis {
  overall_score: number;
  at_risk_students: Array<{
    student_name: string;
    risk_level: string;
    issues: string[];
    recommendations: string[];
  }>;
  class_performance: Array<{
    class_name: string;
    average_score: number;
    trend: string;
  }>;
  subject_analysis: Array<{
    subject_name: string;
    performance_score: number;
    difficulty_level: string;
  }>;
  predictions: Array<{
    student_name: string;
    predicted_grade: string;
    confidence: number;
  }>;
}

interface SchoolRecommendations {
  priority_recommendations: Array<{
    category: string;
    recommendation: string;
    priority: string;
    implementation_steps: string[];
    expected_impact: string;
  }>;
  optimization_score: number;
  areas_for_improvement: string[];
}

export class GroqAIService {
  private static async makeGroqRequest(messages: any[], options: any = {}) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: options.temperature || 0.2,
          max_tokens: options.max_tokens || 4096,
          response_format: options.response_format || { type: "json_object" }
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error making Groq request:', error);
      throw error;
    }
  }

  static async generateOptimalTimetable(schoolData: any): Promise<TimetableGeneration> {
    const prompt = `
    You are an expert school timetable optimization AI. Generate an optimal weekly timetable based on the provided school data.
    
    SCHOOL DATA:
    - Academic Year: ${schoolData.school?.academic_year || '2024-25'}
    - Working Days: ${schoolData.school?.working_days?.join(', ') || 'Monday, Tuesday, Wednesday, Thursday, Friday'}
    - Number of Terms: ${schoolData.school?.number_of_terms || 3}
    
    TEACHERS (${schoolData.teachers?.length || 0}):
    ${schoolData.teachers?.map((t: any) => `
      - ${t.first_name} ${t.last_name} (ID: ${t.teacher_id})
      - Subjects: ${Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects || 'N/A'}
      - Max Periods/Day: ${t.max_periods_per_day || 7}
      - Class Teacher: ${t.is_class_teacher ? 'Yes' : 'No'}
      - Department: ${t.department || 'General'}
    `).join('\n') || 'No teachers available'}
    
    SUBJECTS (${schoolData.subjects?.length || 0}):
    ${schoolData.subjects?.map((s: any) => `
      - ${s.name} (${s.code || 'N/A'})
      - Credits: ${s.credits || 1}
      - Lab Required: ${s.lab_required ? 'Yes' : 'No'}
      - Periods/Week: ${s.periods_per_week || 5}
    `).join('\n') || 'No subjects available'}
    
    CLASSES (${schoolData.classes?.length || 0}):
    ${schoolData.classes?.map((c: any) => `
      - ${c.name} (Grade ${c.grade}-${c.section})
      - Room: ${c.room_number || 'TBD'}
      - Capacity: ${c.capacity || 30}
      - Enrollment: ${c.actual_enrollment || 0}
    `).join('\n') || 'No classes available'}
    
    TIME SLOTS:
    ${schoolData.timeSlots?.map((ts: any) => `
      - ${ts.name}: ${ts.start_time} - ${ts.end_time} (${ts.slot_type})
    `).join('\n') || 'Standard 8 periods from 8:00 AM to 3:00 PM'}
    
    REQUIREMENTS:
    1. NO teacher conflicts (same teacher in multiple classes simultaneously)
    2. NO room conflicts (same room assigned to multiple classes)
    3. Distribute subjects evenly across the week
    4. Respect periods_per_week for each subject
    5. Consider lab_required subjects for lab room assignments
    6. Ensure breaks and lunch periods are maintained
    7. Optimize teacher workload distribution
    8. Balance difficult subjects across different time slots
    
    OUTPUT FORMAT:
    Return a structured JSON object with this exact format:
    {
      "timetable": {
        "Monday": [
          {
            "time_slot": "08:00 - 08:40",
            "period": 1,
            "assignments": [
              {
                "class": "Grade 10-A",
                "subject": "Mathematics",
                "teacher": "John Smith",
                "room": "Room 101"
              }
            ]
          }
        ],
        "Tuesday": [],
        "Wednesday": [],
        "Thursday": [],
        "Friday": []
      },
      "conflicts": [],
      "optimization_score": 95,
      "recommendations": [
        "Consider moving Physics lab sessions to morning slots for better concentration",
        "Balance Mathematics classes across different time periods"
      ]
    }
    `;

    const messages = [
      {
        role: "system",
        content: "You are an expert school timetable optimization AI. Create conflict-free, optimal weekly schedules. Always return valid JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.makeGroqRequest(messages, { temperature: 0.2, max_tokens: 8192 });
  }

  static async analyzeStudentPerformance(schoolData: any): Promise<PerformanceAnalysis> {
    const prompt = `
    You are an educational data analyst AI. Analyze the school's student performance patterns and provide insights.
    
    SCHOOL DATA:
    - Total Students: ${schoolData.students?.length || 0}
    - Total Classes: ${schoolData.classes?.length || 0}
    - Academic Year: ${schoolData.school?.academic_year || '2024-25'}
    
    STUDENTS:
    ${schoolData.students?.slice(0, 10).map((s: any) => `
      - ${s.first_name} ${s.last_name} (Grade ${s.grade}-${s.section})
      - Student ID: ${s.student_id}
    `).join('\n') || 'No student data available'}
    
    CLASSES:
    ${schoolData.classes?.map((c: any) => `
      - ${c.name}: ${c.actual_enrollment} students enrolled
      - Capacity: ${c.capacity}
      - Utilization: ${c.capacity ? Math.round((c.actual_enrollment / c.capacity) * 100) : 0}%
    `).join('\n') || 'No class data available'}
    
    SUBJECTS:
    ${schoolData.subjects?.map((s: any) => `
      - ${s.name}: ${s.periods_per_week} periods/week
      - Credits: ${s.credits}
      - Lab Required: ${s.lab_required ? 'Yes' : 'No'}
    `).join('\n') || 'No subject data available'}
    
    Analyze patterns, identify potential at-risk students based on enrollment data, and provide educational insights.
    
    Return JSON with this format:
    {
      "overall_score": 85,
      "at_risk_students": [
        {
          "student_name": "Example Student",
          "risk_level": "Medium",
          "issues": ["Low attendance pattern", "Difficulty in Mathematics"],
          "recommendations": ["Additional tutoring", "Parent consultation"]
        }
      ],
      "class_performance": [
        {
          "class_name": "Grade 10-A",
          "average_score": 78,
          "trend": "Improving"
        }
      ],
      "subject_analysis": [
        {
          "subject_name": "Mathematics",
          "performance_score": 82,
          "difficulty_level": "High"
        }
      ],
      "predictions": [
        {
          "student_name": "Example Student",
          "predicted_grade": "B+",
          "confidence": 85
        }
      ]
    }
    `;

    const messages = [
      {
        role: "system",
        content: "You are an educational data analyst. Analyze student performance patterns and provide actionable insights. Always return valid JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.makeGroqRequest(messages, { temperature: 0.4, max_tokens: 4096 });
  }

  static async generateSchoolRecommendations(schoolData: any): Promise<SchoolRecommendations> {
    const prompt = `
    You are a school management optimization expert. Analyze the complete school data and provide actionable recommendations.
    
    SCHOOL OVERVIEW:
    - Name: ${schoolData.school?.name || 'School'}
    - Students: ${schoolData.students?.length || 0}
    - Teachers: ${schoolData.teachers?.length || 0}
    - Classes: ${schoolData.classes?.length || 0}
    - Subjects: ${schoolData.subjects?.length || 0}
    - Infrastructure: ${schoolData.infrastructure?.length || 0} rooms
    
    TEACHER ANALYSIS:
    - Average max periods per day: ${schoolData.teachers?.reduce((sum: number, t: any) => sum + (t.max_periods_per_day || 7), 0) / (schoolData.teachers?.length || 1) || 7}
    - Class teachers: ${schoolData.teachers?.filter((t: any) => t.is_class_teacher).length || 0}
    
    CLASS UTILIZATION:
    ${schoolData.classes?.map((c: any) => `
      - ${c.name}: ${c.actual_enrollment}/${c.capacity} students (${c.capacity ? Math.round((c.actual_enrollment / c.capacity) * 100) : 0}% utilization)
    `).join('\n') || 'No class data'}
    
    INFRASTRUCTURE:
    ${schoolData.infrastructure?.map((inf: any) => `
      - ${inf.room_name} (${inf.room_type}): Capacity ${inf.capacity}
    `).join('\n') || 'No infrastructure data'}
    
    Provide specific, actionable recommendations for school improvement with priority levels and implementation steps.
    
    Return JSON with this format:
    {
      "priority_recommendations": [
        {
          "category": "Resource Management",
          "recommendation": "Optimize classroom utilization by redistributing students",
          "priority": "High",
          "implementation_steps": [
            "Analyze current class sizes",
            "Identify underutilized classrooms",
            "Redistribute students based on capacity"
          ],
          "expected_impact": "15% improvement in space utilization"
        }
      ],
      "optimization_score": 78,
      "areas_for_improvement": [
        "Teacher workload balancing",
        "Classroom space optimization",
        "Subject scheduling efficiency"
      ]
    }
    `;

    const messages = [
      {
        role: "system",
        content: "You are a school management optimization expert. Provide practical, actionable recommendations for school improvement. Always return valid JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.makeGroqRequest(messages, { temperature: 0.3, max_tokens: 3072 });
  }

  static async resolveScheduleConflicts(currentTimetable: any, conflicts: any[]): Promise<any> {
    const prompt = `
    You are a timetable conflict resolution expert. Analyze the current timetable and resolve the detected conflicts.
    
    CURRENT TIMETABLE:
    ${JSON.stringify(currentTimetable, null, 2)}
    
    CONFLICTS DETECTED:
    ${JSON.stringify(conflicts, null, 2)}
    
    Provide solutions to resolve these conflicts while maintaining schedule quality and teacher preferences.
    
    Return JSON with resolved timetable and explanation of changes:
    {
      "resolved_timetable": {},
      "changes_made": [
        "Moved Mathematics class from Period 1 to Period 3 to resolve teacher conflict"
      ],
      "remaining_conflicts": [],
      "optimization_score": 92
    }
    `;

    const messages = [
      {
        role: "system",
        content: "You are a timetable conflict resolution expert. Resolve scheduling conflicts while maintaining optimal schedules. Always return valid JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.makeGroqRequest(messages, { temperature: 0.3, max_tokens: 4096 });
  }
}
