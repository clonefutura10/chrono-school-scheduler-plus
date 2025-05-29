
import { supabase } from '@/integrations/supabase/client';

export interface ClassData {
  id: string;
  grade: string;
  division: string;
  students: number;
  subjects: string[];
  classTeacher: string;
  capacity: number;
}

export interface StudentData {
  id: string;
  name: string;
  rollNo: string;
  attendance: number;
  performance: string;
  grade: string;
  section: string;
}

// Generate mock students with variation on each refresh
const generateMockStudents = (grade: string, division: string): StudentData[] => {
  const firstNames = ["Alex", "Emily", "Michael", "Sophia", "Ryan", "Isabella", "David", "Emma", "Noah", "Olivia"];
  const lastNames = ["Johnson", "Chen", "Davis", "Lee", "Smith", "Wilson", "Brown", "Garcia", "Martinez", "Anderson"];
  const performances = ["Excellent", "Good", "Average", "Need Improvement"];
  
  const studentCount = Math.floor(Math.random() * 15) + 25; // 25-40 students
  const students: StudentData[] = [];
  
  for (let i = 1; i <= studentCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const attendance = Math.floor(Math.random() * 20) + 80; // 80-100%
    const performance = performances[Math.floor(Math.random() * performances.length)];
    
    students.push({
      id: `${grade}${division}${i.toString().padStart(2, '0')}`,
      name: `${firstName} ${lastName}`,
      rollNo: `${grade}${division}${i.toString().padStart(2, '0')}`,
      attendance,
      performance,
      grade,
      section: division
    });
  }
  
  return students;
};

export const fetchClassData = async (): Promise<ClassData[]> => {
  try {
    // Fetch classes from Supabase with explicit column hint for teacher relationship
    const { data: classesData, error: classesError } = await supabase
      .from('classes')
      .select(`
        *,
        class_teacher:class_teacher_id(first_name, last_name)
      `);

    // Fetch subjects
    const { data: subjectsData, error: subjectsError } = await supabase
      .from('subjects')
      .select('*');

    if (classesError) {
      console.error('Error fetching classes:', classesError);
    }

    if (subjectsError) {
      console.error('Error fetching subjects:', subjectsError);
    }

    let processedClasses: ClassData[] = [];

    if (classesData && classesData.length > 0) {
      processedClasses = classesData.map(cls => {
        // Use type assertion to bypass TypeScript inference issues
        const clsAny = cls as any;
        const teacher = clsAny.class_teacher;
        
        return {
          id: cls.id,
          grade: cls.grade || '',
          division: cls.section || 'A',
          students: cls.capacity || Math.floor(Math.random() * 15) + 30,
          subjects: subjectsData?.map(s => s.name) || [],
          classTeacher: teacher ? 
            `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'TBD' 
            : 'TBD',
          capacity: cls.capacity || 40
        };
      });
    }

    // If no real data, generate mock data
    if (processedClasses.length === 0) {
      const grades = ['6', '7', '8', '9', '10', '11', '12'];
      const divisions = ['A', 'B', 'C'];
      const mockTeachers = ["Sarah Johnson", "Michael Chen", "Emily Davis", "James Wilson", "Lisa Anderson"];
      const mockSubjects = ["English", "Mathematics", "Science", "Social Studies", "Physical Education"];

      processedClasses = grades.flatMap(grade => 
        divisions.slice(0, Math.floor(Math.random() * 3) + 1).map(division => ({
          id: `${grade}-${division}`,
          grade,
          division,
          students: Math.floor(Math.random() * 15) + 30,
          subjects: mockSubjects,
          classTeacher: mockTeachers[Math.floor(Math.random() * mockTeachers.length)],
          capacity: 45
        }))
      );
    }

    return processedClasses;
  } catch (error) {
    console.error('Error in fetchClassData:', error);
    // Return mock data as fallback
    const grades = ['6', '7', '8', '9', '10', '11', '12'];
    const divisions = ['A', 'B', 'C'];
    const mockTeachers = ["Sarah Johnson", "Michael Chen", "Emily Davis", "James Wilson", "Lisa Anderson"];
    const mockSubjects = ["English", "Mathematics", "Science", "Social Studies", "Physical Education"];

    return grades.flatMap(grade => 
      divisions.slice(0, Math.floor(Math.random() * 3) + 1).map(division => ({
        id: `${grade}-${division}`,
        grade,
        division,
        students: Math.floor(Math.random() * 15) + 30,
        subjects: mockSubjects,
        classTeacher: mockTeachers[Math.floor(Math.random() * mockTeachers.length)],
        capacity: 45
      }))
    );
  }
};

export const fetchStudentsForClass = async (grade: string, division: string): Promise<StudentData[]> => {
  try {
    // Fetch students from Supabase
    const { data: studentsData, error } = await supabase
      .from('students')
      .select('*')
      .eq('grade', grade)
      .eq('section', division);

    if (error) {
      console.error('Error fetching students:', error);
    }

    let processedStudents: StudentData[] = [];

    if (studentsData && studentsData.length > 0) {
      processedStudents = studentsData.map(student => ({
        id: student.id,
        name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student',
        rollNo: student.student_id || `${grade}${division}00`,
        attendance: Math.floor(Math.random() * 20) + 80, // Mock attendance
        performance: ["Excellent", "Good", "Average"][Math.floor(Math.random() * 3)], // Mock performance
        grade: student.grade || grade,
        section: student.section || division
      }));
    }

    // If no real data or few students, supplement with mock data
    if (processedStudents.length < 20) {
      const mockStudents = generateMockStudents(grade, division);
      processedStudents = [...processedStudents, ...mockStudents.slice(0, 25 - processedStudents.length)];
    }

    return processedStudents;
  } catch (error) {
    console.error('Error in fetchStudentsForClass:', error);
    return generateMockStudents(grade, division);
  }
};
