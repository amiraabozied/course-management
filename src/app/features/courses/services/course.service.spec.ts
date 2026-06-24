import { TestBed } from '@angular/core/testing';
import { CourseService } from './course.service';
import { Course } from '../models/course.model';

describe('CourseService', () => {
  let service: CourseService;

  const seed: Course[] = [
    { id: 1, courseName: 'Angular', instructorName: 'Ali', category: 'Frontend', duration: 20, price: 1500, status: 'Active', createdDate: '2026-01-01' },
    { id: 2, courseName: 'React',   instructorName: 'Mona', category: 'Frontend', duration: 18, price: 1400, status: 'Draft',  createdDate: '2026-01-02' },
  ];

  beforeEach(() => {
    localStorage.setItem('courses', JSON.stringify(seed));
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseService);
  });

  afterEach(() => localStorage.removeItem('courses'));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('returns all stored courses', (done) => {
      service.getAll().subscribe(courses => {
        expect(courses.length).toBe(2);
        expect(courses[0].courseName).toBe('Angular');
        done();
      });
    });

    it('falls back to empty array when localStorage is corrupted', (done) => {
      localStorage.setItem('courses', 'INVALID_JSON');
      service.getAll().subscribe(courses => {
        expect(Array.isArray(courses)).toBeTrue();
        done();
      });
    });
  });

  describe('getById()', () => {
    it('returns the correct course', (done) => {
      service.getById(1).subscribe(course => {
        expect(course.courseName).toBe('Angular');
        done();
      });
    });

    it('errors when course does not exist', (done) => {
      service.getById(999).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe('Course not found');
          done();
        },
      });
    });
  });

  describe('create()', () => {
    it('adds a new course and assigns a new id', (done) => {
      service.create({ courseName: 'Vue', instructorName: 'Sara', category: 'Frontend', duration: 12, price: 1000, status: 'Draft' }).subscribe(created => {
        expect(created.id).toBe(3);
        expect(created.courseName).toBe('Vue');
        expect(created.createdDate).toBeTruthy();
        done();
      });
    });

    it('persists the new course in localStorage', (done) => {
      service.create({ courseName: 'Vue', instructorName: 'Sara', category: 'Frontend', duration: 12, price: 1000, status: 'Draft' }).subscribe(() => {
        service.getAll().subscribe(courses => {
          expect(courses.length).toBe(3);
          done();
        });
      });
    });
  });

  describe('update()', () => {
    it('updates an existing course', (done) => {
      service.update(1, { courseName: 'Angular Advanced', instructorName: 'Ali', category: 'Frontend', duration: 30, price: 2000, status: 'Active' }).subscribe(updated => {
        expect(updated.courseName).toBe('Angular Advanced');
        expect(updated.duration).toBe(30);
        done();
      });
    });

    it('errors when course to update does not exist', (done) => {
      service.update(999, { courseName: 'X', instructorName: 'X', category: 'X', duration: 1, price: 1, status: 'Draft' }).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe('Course not found');
          done();
        },
      });
    });
  });

  describe('delete()', () => {
    it('removes the course from storage', (done) => {
      service.delete(1).subscribe(() => {
        service.getAll().subscribe(courses => {
          expect(courses.length).toBe(1);
          expect(courses[0].id).toBe(2);
          done();
        });
      });
    });
  });
});
