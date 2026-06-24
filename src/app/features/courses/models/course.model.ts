export type CourseStatus = 'Active' | 'Draft' | 'Archived';

export interface Course {
  id: number;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  description?: string;
  createdDate: string;
}

export interface CourseFormData {
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  description?: string;
}
