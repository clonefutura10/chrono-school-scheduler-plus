
export interface School {
  id: string;
  name: string;
  principal_name: string | null;
  academic_year: string | null;
  academic_year_start: string | null;
  academic_year_end: string | null;
  number_of_terms: number;
  working_days: string[];
  school_vision: string | null;
  school_type: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  grade: string | null;
  section: string | null;
  date_of_birth: string | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  parent_contact: string | null;
  address: string | null;
  assigned_class_id: string | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  teacher_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  department: string | null;
  subjects: string[];
  qualification: string | null;
  qualification_details: string | null;
  experience_years: number | null;
  is_class_teacher: boolean;
  max_periods_per_day: number;
  max_hours_per_day: number;
  preferences: string | null;
  availability_notes: string | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string | null;
  department: string | null;
  description: string | null;
  credits: number;
  periods_per_week: number;
  lab_required: boolean;
  school_id: string | null;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string | null;
  section: string | null;
  room_number: string | null;
  capacity: number | null;
  actual_enrollment: number;
  periods_per_day: number;
  periods_per_week: number;
  class_teacher_id: string | null;
  teacher_id: string | null;
  school_id: string | null;
  created_at: string;
}

export interface TimeSlot {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  slot_type: string;
  type: string | null;
  is_break: boolean;
  school_id: string | null;
  created_at: string;
}

export interface AcademicCalendarEvent {
  id: string;
  event_name: string;
  event_type: string;
  start_date: string;
  end_date: string;
  description: string | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Infrastructure {
  id: string;
  room_name: string;
  room_type: string;
  capacity: number | null;
  equipment: any[];
  is_available: boolean;
  grade_assignment: string | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherSubjectMapping {
  id: string;
  teacher_id: string | null;
  subject_id: string | null;
  class_id: string | null;
  periods_per_week: number;
  preferred_time_slots: string[] | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Timetable {
  id: string;
  day_of_week: string;
  period_number: number;
  time_slot_id: string | null;
  class_id: string | null;
  subject_id: string | null;
  teacher_id: string | null;
  room_number: string | null;
  schedule_data: any | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

// Combined interfaces for API responses
export interface StudentWithClass extends Student {
  classes?: {
    id: string;
    name: string;
    grade: string | null;
    section: string | null;
    teachers?: {
      first_name: string;
      last_name: string;
    } | null;
  } | null;
}

export interface TeacherWithAssignments extends Teacher {
  teacher_subject_mappings?: Array<{
    periods_per_week: number;
    subjects?: {
      name: string;
      lab_required: boolean;
    } | null;
    classes?: {
      name: string;
      grade: string | null;
      section: string | null;
      actual_enrollment: number;
    } | null;
  }>;
}

export interface ClassWithTeacher extends Class {
  teachers?: {
    first_name: string;
    last_name: string;
  } | null;
}
