import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Course, CourseFormData } from '../models/course.model';

const STORAGE_KEY = 'courses';
const INITIAL_COURSES: Course[] = [
  // {
  //   id: 1,
  //   courseName: 'Angular Fundamentals',
  //   instructorName: 'Ahmed Ali',
  //   category: 'Frontend',
  //   duration: 20,
  //   price: 1500,
  //   status: 'Active',
  //   createdDate: '2026-06-01',
  // },
  // {
  //   id: 2,
  //   courseName: 'React Essentials',
  //   instructorName: 'Mona Hassan',
  //   category: 'Frontend',
  //   duration: 18,
  //   price: 1400,
  //   status: 'Active',
  //   createdDate: '2026-06-03',
  // },
  // {
  //   id: 3,
  //   courseName: 'Node.js Basics',
  //   instructorName: 'Sara Mohamed',
  //   category: 'Backend',
  //   duration: 15,
  //   price: 1200,
  //   status: 'Draft',
  //   createdDate: '2026-06-05',
  // },
  // {
  //   id: 4,
  //   courseName: 'UI/UX Design Basics',
  //   instructorName: 'Omar Hassan',
  //   category: 'Design',
  //   duration: 10,
  //   price: 900,
  //   status: 'Archived',
  //   createdDate: '2026-06-10',
  // },
];

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  getAll(): Observable<Course[]> {
    return of(this.readCourses());
  }

  getById(id: number): Observable<Course> {
    const course = this.readCourses().find(item => item.id === id);

    if (!course) {
      return throwError(() => new Error('Course not found'));
    }

    return of(course);
  }

  create(data: CourseFormData): Observable<Course> {
    const courses = this.readCourses();
    const newCourse: Course = {
      ...data,
      id: this.getNextId(courses),
      createdDate: new Date().toISOString().split('T')[0],
    };

    this.writeCourses([...courses, newCourse]);
    return of(newCourse);
  }

  update(id: number, data: CourseFormData): Observable<Course> {
    const courses = this.readCourses();
    const index = courses.findIndex(course => course.id === id);

    if (index === -1) {
      return throwError(() => new Error('Course not found'));
    }

    const updatedCourse: Course = {
      ...courses[index],
      ...data,
    };

    courses[index] = updatedCourse;
    this.writeCourses(courses);
    return of(updatedCourse);
  }

  delete(id: number): Observable<void> {
    const courses = this.readCourses();
    this.writeCourses(courses.filter(course => course.id !== id));
    return of(void 0);
  }

  private readCourses(): Course[] {
    const storedCourses = localStorage.getItem(STORAGE_KEY);

    if (!storedCourses) {
      this.writeCourses(INITIAL_COURSES);
      return [...INITIAL_COURSES];
    }

    try {
      return JSON.parse(storedCourses) as Course[];
    } catch {
      this.writeCourses(INITIAL_COURSES);
      return [...INITIAL_COURSES];
    }
  }

  private writeCourses(courses: Course[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }

  private getNextId(courses: Course[]): number {
    return courses.length ? Math.max(...courses.map(course => course.id)) + 1 : 1;
  }
}
