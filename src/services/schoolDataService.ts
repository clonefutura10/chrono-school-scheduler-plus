import { supabase } from '@/integrations/supabase/client';
import type { 
  School, 
  Student, 
  Teacher, 
  Subject, 
  Class, 
  TimeSlot, 
  AcademicCalendarEvent, 
  Infrastructure,
  TeacherSubjectMapping,
  StudentWithClass,
  TeacherWithAssignments,
  ClassWithTeacher
} from '@/types/database';

export class SchoolDataService {
  // School data
  static async getSchoolInfo(): Promise<School | null> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching school info:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSchoolInfo:', error);
      return null;
    }
  }

  // Student data
  static async getAllStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllStudents:', error);
      return [];
    }
  }

  static async getStudentById(studentId: string): Promise<StudentWithClass | null> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          assigned_class:assigned_class_id (
            id,
            name,
            grade,
            section,
            class_teacher:class_teacher_id (
              first_name,
              last_name
            )
          )
        `)
        .eq('id', studentId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching student by ID:', error);
        return null;
      }

      if (data) {
        return {
          ...data,
          classes: data.assigned_class ? {
            ...data.assigned_class,
            teachers: data.assigned_class.class_teacher || null
          } : null
        } as StudentWithClass;
      }

      return null;
    } catch (error) {
      console.error('Error in getStudentById:', error);
      return null;
    }
  }

  static async getStudentCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error counting students:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getStudentCount:', error);
      return 0;
    }
  }

  // Teacher data
  static async getAllTeachers(): Promise<Teacher[]> {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teachers:', error);
        return [];
      }

      const processedData = (data || []).map(teacher => ({
        ...teacher,
        subjects: Array.isArray(teacher.subjects) 
          ? teacher.subjects as string[]
          : typeof teacher.subjects === 'string' 
            ? [teacher.subjects]
            : []
      })) as Teacher[];

      return processedData;
    } catch (error) {
      console.error('Error in getAllTeachers:', error);
      return [];
    }
  }

  static async getTeacherById(teacherId: string): Promise<TeacherWithAssignments | null> {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          teacher_subject_mappings (
            periods_per_week,
            subjects (
              name,
              lab_required
            ),
            classes (
              name,
              grade,
              section,
              actual_enrollment
            )
          )
        `)
        .eq('id', teacherId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching teacher by ID:', error);
        return null;
      }

      if (data) {
        return {
          ...data,
          subjects: Array.isArray(data.subjects) 
            ? data.subjects as string[]
            : typeof data.subjects === 'string' 
              ? [data.subjects]
              : []
        } as TeacherWithAssignments;
      }

      return null;
    } catch (error) {
      console.error('Error in getTeacherById:', error);
      return null;
    }
  }

  static async getTeacherCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error counting teachers:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getTeacherCount:', error);
      return 0;
    }
  }

  // Subject data
  static async getAllSubjects(): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching subjects:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllSubjects:', error);
      return [];
    }
  }

  // Class data
  static async getAllClasses(): Promise<ClassWithTeacher[]> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          class_teacher:class_teacher_id (
            first_name,
            last_name
          )
        `)
        .order('grade', { ascending: true });

      if (error) {
        console.error('Error fetching classes:', error);
        return [];
      }

      const processedData = (data || []).map(classItem => ({
        ...classItem,
        teachers: classItem.class_teacher || null
      })) as ClassWithTeacher[];

      return processedData;
    } catch (error) {
      console.error('Error in getAllClasses:', error);
      return [];
    }
  }

  static async getClassroomCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('infrastructure')
        .select('*', { count: 'exact', head: true })
        .eq('room_type', 'classroom');

      if (error) {
        console.error('Error counting classrooms:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getClassroomCount:', error);
      return 0;
    }
  }

  // New AI-specific data fetching methods
  static async getCompleteSchoolDataForAI() {
    try {
      const [
        school,
        teachers,
        students,
        subjects,
        classes,
        timeSlots,
        infrastructure,
        teacherMappings
      ] = await Promise.all([
        this.getSchoolInfo(),
        this.getAllTeachers(),
        this.getAllStudents(),
        this.getAllSubjects(),
        this.getAllClasses(),
        this.getAllTimeSlots(),
        this.getAllInfrastructure(),
        this.getTeacherSubjectMappings()
      ]);

      return {
        school,
        teachers,
        students,
        subjects,
        classes,
        timeSlots,
        infrastructure,
        teacherMappings
      };
    } catch (error) {
      console.error('Error fetching complete school data:', error);
      return null;
    }
  }

  // Time slots
  static async getAllTimeSlots(): Promise<TimeSlot[]> {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching time slots:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllTimeSlots:', error);
      return [];
    }
  }

  // Academic calendar
  static async getAcademicEvents(): Promise<AcademicCalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('academic_calendar')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching academic events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAcademicEvents:', error);
      return [];
    }
  }

  // Infrastructure
  static async getAllInfrastructure(): Promise<Infrastructure[]> {
    try {
      const { data, error } = await supabase
        .from('infrastructure')
        .select('*')
        .order('room_name', { ascending: true });

      if (error) {
        console.error('Error fetching infrastructure:', error);
        return [];
      }

      const processedData = (data || []).map(item => ({
        ...item,
        equipment: Array.isArray(item.equipment) 
          ? item.equipment 
          : []
      })) as Infrastructure[];

      return processedData;
    } catch (error) {
      console.error('Error in getAllInfrastructure:', error);
      return [];
    }
  }

  // Teacher subject mappings
  static async getTeacherSubjectMappings(): Promise<TeacherSubjectMapping[]> {
    try {
      const { data, error } = await supabase
        .from('teacher_subject_mappings')
        .select('*');

      if (error) {
        console.error('Error fetching teacher subject mappings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTeacherSubjectMappings:', error);
      return [];
    }
  }

  // Real-time subscriptions
  static setupRealtimeSubscriptions(callbacks: {
    onStudentChange?: (payload: any) => void;
    onTeacherChange?: (payload: any) => void;
    onClassChange?: (payload: any) => void;
    onSchoolChange?: (payload: any) => void;
  }) {
    const channel = supabase.channel('school_changes');

    if (callbacks.onStudentChange) {
      channel.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'students' }, 
        callbacks.onStudentChange
      );
    }

    if (callbacks.onTeacherChange) {
      channel.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'teachers' }, 
        callbacks.onTeacherChange
      );
    }

    if (callbacks.onClassChange) {
      channel.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'classes' }, 
        callbacks.onClassChange
      );
    }

    if (callbacks.onSchoolChange) {
      channel.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'schools' }, 
        callbacks.onSchoolChange
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Generate dynamic mock data for fallback
  static generateMockStudentData() {
    const names = ["John Smith", "Emma Wilson", "Michael Brown", "Sophia Davis", "Ryan Johnson", "Isabella Garcia"];
    const grades = ["9", "10", "11", "12"];
    const divisions = ["A", "B", "C"];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    const randomDivision = divisions[Math.floor(Math.random() * divisions.length)];
    const randomAttendance = Math.floor(Math.random() * 15) + 85;
    const randomRanking = Math.floor(Math.random() * 10) + 1;
    
    return {
      name: randomName,
      id: `STU${randomGrade}0${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
      grade: randomGrade,
      division: randomDivision,
      attendance: randomAttendance,
      ranking: randomRanking,
      completedAssignments: Math.floor(Math.random() * 5) + 25,
      totalAssignments: Math.floor(Math.random() * 8) + 30,
      classSize: Math.floor(Math.random() * 20) + 30,
      learningProgress: Math.floor(Math.random() * 25) + 70
    };
  }

  static generateMockTeacherData() {
    const names = ["Dr. Emily Wilson", "Prof. Michael Chen", "Ms. Sarah Davis", "Mr. James Rodriguez", "Dr. Lisa Anderson"];
    const subjects = [
      ["Physics", "Chemistry"],
      ["Mathematics", "Statistics"],
      ["English", "Literature"],
      ["History", "Geography"],
      ["Biology", "Environmental Science"]
    ];

    const randomIndex = Math.floor(Math.random() * names.length);
    
    return {
      name: names[randomIndex],
      subjects: subjects[randomIndex],
      totalClasses: Math.floor(Math.random() * 10) + 15,
      maxCapacity: 30,
      grades: ["Class 9", "Class 10"],
      department: "Science"
    };
  }
}
