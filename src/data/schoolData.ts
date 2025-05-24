
// Core school data based on the provided master grid
export const schoolInfrastructure = {
  totalClassrooms: 40,
  specialRooms: [
    { name: "Computer Labs", count: 2 },
    { name: "Library", count: 1 },
    { name: "Science Lab", count: 1 },
    { name: "Math Lab", count: 1 }
  ],
  playgroundAreas: ["Indoor Gym", "Outdoor Playground", "Sports Ground"],
  assemblyHall: "1 Auditorium"
};

export const studentStrengthData = [
  { grade: "Pre-Primary", totalStudents: 120, idealClassSize: 20, divisions: 6 },
  { grade: "Class 1", totalStudents: 90, idealClassSize: 30, divisions: 3 },
  { grade: "Class 2", totalStudents: 95, idealClassSize: 30, divisions: 3 },
  { grade: "Class 3", totalStudents: 88, idealClassSize: 30, divisions: 3 },
  { grade: "Class 4", totalStudents: 92, idealClassSize: 30, divisions: 3 },
  { grade: "Class 5", totalStudents: 85, idealClassSize: 30, divisions: 3 },
  { grade: "Class 6", totalStudents: 78, idealClassSize: 30, divisions: 3 },
  { grade: "Class 7", totalStudents: 82, idealClassSize: 30, divisions: 3 },
  { grade: "Class 8", totalStudents: 75, idealClassSize: 30, divisions: 3 },
  { grade: "Class 9", totalStudents: 70, idealClassSize: 30, divisions: 2 },
  { grade: "Class 10", totalStudents: 68, idealClassSize: 30, divisions: 2 },
  { grade: "Class 11", totalStudents: 65, idealClassSize: 30, divisions: 2 },
  { grade: "Class 12", totalStudents: 60, idealClassSize: 30, divisions: 2 }
];

export const subjectAllocationData = [
  { grade: "Class 1", subject: "English", periodsPerWeek: 5, teacher: "Mrs. Sharma", divisions: 3 },
  { grade: "Class 1", subject: "Math", periodsPerWeek: 5, teacher: "Mr. Verma", divisions: 3 },
  { grade: "Class 1", subject: "EVS", periodsPerWeek: 3, teacher: "Mrs. Fernandez", divisions: 3 },
  { grade: "Class 2", subject: "English", periodsPerWeek: 5, teacher: "Mrs. Sharma", divisions: 3 },
  { grade: "Class 2", subject: "Math", periodsPerWeek: 5, teacher: "Mr. Verma", divisions: 3 },
  { grade: "Class 2", subject: "EVS", periodsPerWeek: 3, teacher: "Mrs. Fernandez", divisions: 3 },
  { grade: "Class 3", subject: "English", periodsPerWeek: 5, teacher: "Mrs. Sharma", divisions: 3 },
  { grade: "Class 3", subject: "Math", periodsPerWeek: 5, teacher: "Mr. Verma", divisions: 3 },
  { grade: "Class 3", subject: "EVS", periodsPerWeek: 3, teacher: "Mrs. Fernandez", divisions: 3 },
  { grade: "Class 4", subject: "English", periodsPerWeek: 5, teacher: "Mrs. Sharma", divisions: 3 },
  { grade: "Class 4", subject: "Math", periodsPerWeek: 4, teacher: "Mr. Kumar", divisions: 3 },
  { grade: "Class 4", subject: "EVS", periodsPerWeek: 3, teacher: "Mrs. Patel", divisions: 3 },
  { grade: "Class 10", subject: "Science", periodsPerWeek: 6, teacher: "Mr. Khan", divisions: 2 },
  { grade: "Class 10", subject: "English", periodsPerWeek: 4, teacher: "Sarah Johnson", divisions: 2 },
  { grade: "Class 10", subject: "Math", periodsPerWeek: 6, teacher: "John Smith", divisions: 2 },
  { grade: "Class 11", subject: "Physics", periodsPerWeek: 6, teacher: "Michael Brown", divisions: 2 },
  { grade: "Class 11", subject: "Chemistry", periodsPerWeek: 6, teacher: "Jessica Lee", divisions: 2 },
  { grade: "Class 11", subject: "Biology", periodsPerWeek: 6, teacher: "Karen Williams", divisions: 2 },
  { grade: "Class 12", subject: "Physics", periodsPerWeek: 6, teacher: "Michael Brown", divisions: 2 },
  { grade: "Class 12", subject: "Chemistry", periodsPerWeek: 6, teacher: "Jessica Lee", divisions: 2 },
  { grade: "Class 12", subject: "Biology", periodsPerWeek: 6, teacher: "Karen Williams", divisions: 2 }
];

export const teacherLoadData = [
  { name: "Mrs. Sharma", subjects: ["English (Class 1-4)"], totalClasses: 60, maxCapacity: 30 },
  { name: "Mr. Verma", subjects: ["Math (Class 1-3)"], totalClasses: 45, maxCapacity: 30 },
  { name: "Mrs. Fernandez", subjects: ["EVS (Class 1-3)"], totalClasses: 27, maxCapacity: 25 },
  { name: "Mr. Khan", subjects: ["Science (Class 10)"], totalClasses: 12, maxCapacity: 30 },
  { name: "Sarah Johnson", subjects: ["English (Class 9-10)"], totalClasses: 16, maxCapacity: 30 },
  { name: "Michael Brown", subjects: ["Physics (Class 11-12)"], totalClasses: 24, maxCapacity: 30 },
  { name: "Jessica Lee", subjects: ["Chemistry (Class 11-12)"], totalClasses: 24, maxCapacity: 30 },
  { name: "Karen Williams", subjects: ["Biology (Class 11-12)"], totalClasses: 24, maxCapacity: 30 },
  { name: "Emily Clark", subjects: ["Computer Science"], totalClasses: 15, maxCapacity: 30 },
  { name: "Robert Johnson", subjects: ["Physical Education"], totalClasses: 25, maxCapacity: 35 },
];

export const academicStructure = {
  academicYear: { start: "June 1, 2025", end: "March 31, 2026" },
  workingDays: 220,
  theme: "Innovation & Inclusion",
  terms: [
    { name: "Term 1", period: "Jun - Oct", workingDays: 110, startDate: "2025-06-01", endDate: "2025-10-15" },
    { name: "Term 2", period: "Nov - Mar", workingDays: 110, startDate: "2025-11-01", endDate: "2026-03-31" }
  ],
  examinations: [
    { type: "Unit Test 1", period: "July 15-20", startDate: "2025-07-15", endDate: "2025-07-20" },
    { type: "Mid-Term", period: "August 20-30", startDate: "2025-08-20", endDate: "2025-08-30" },
    { type: "Unit Test 2", period: "December 10-15", startDate: "2025-12-10", endDate: "2025-12-15" },
    { type: "Final Exams", period: "March 1-15", startDate: "2026-03-01", endDate: "2026-03-15" }
  ]
};

export const weeklyPlanningData = [
  {
    week: "June 1-7",
    prePrimary: "School Reopens, Welcome Songs",
    primary: "Orientation, Class Allotments",
    secondary: "Orientation, Time-Table Finalization"
  },
  {
    week: "June 8-14",
    prePrimary: "Rhymes & Circle Time",
    primary: "Class Rules & Club Selections",
    secondary: "Leadership Elections & Career Talks"
  },
  {
    week: "June 15-21",
    prePrimary: "Colour Day: Red",
    primary: "Storytelling Competition",
    secondary: "Career Orientation Session (XI-XII)"
  },
  {
    week: "June 22-30",
    prePrimary: "Handprint Art & Free Play",
    primary: "Drawing Competition",
    secondary: "Practical Demo: Lab Safety & Project Planning"
  }
];

export const coCurricularEvents = [
  { event: "Independence Day", date: "2025-08-15", type: "celebration", dateObj: new Date("2025-08-15") },
  { event: "Teachers' Day", date: "2025-09-05", type: "celebration", dateObj: new Date("2025-09-05") },
  { event: "Diwali Break", date: "2025-11-01", type: "holiday", dateObj: new Date("2025-11-01") },
  { event: "Science Fair", date: "2025-10-20", type: "competition", dateObj: new Date("2025-10-20") },
  { event: "Annual Sports Day", date: "2025-12-15", type: "sports", dateObj: new Date("2025-12-15") },
  { event: "Annual Day", date: "2025-12-20", type: "celebration", dateObj: new Date("2025-12-20") },
  { event: "Winter Break", date: "2025-12-24", type: "holiday", dateObj: new Date("2025-12-24") },
  { event: "Classes Resume", date: "2026-01-06", type: "academic", dateObj: new Date("2026-01-06") },
  { event: "Science Exhibition", date: "2026-01-15", type: "exhibition", dateObj: new Date("2026-01-15") },
  { event: "Sports Week", date: "2026-02-10", type: "sports", dateObj: new Date("2026-02-10") }
];

export const staffPlanningData = [
  { activity: "Teacher Orientation", date: "May 25-30", participants: "All Staff" },
  { activity: "Curriculum Planning", date: "Monthly", participants: "Subject Heads" },
  { activity: "Parent-Teacher Meetings", date: "End of each term", participants: "Class Teachers" },
  { activity: "Internal Assessment", date: "Quarterly", participants: "Academic Team" }
];
