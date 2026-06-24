import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CourseListComponent } from './course-list.component';
import { CourseService } from '../../services/course.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { Course } from '../../models/course.model';

const mockCourses: Course[] = [
  { id: 1, courseName: 'Angular', instructorName: 'Ali',  category: 'Frontend', duration: 20, price: 1500, status: 'Active',   createdDate: '2026-01-01' },
  { id: 2, courseName: 'React',   instructorName: 'Mona', category: 'Frontend', duration: 18, price: 1400, status: 'Draft',    createdDate: '2026-01-02' },
  { id: 3, courseName: 'Node',    instructorName: 'Sara', category: 'Backend',  duration: 15, price: 1200, status: 'Archived', createdDate: '2026-01-03' },
  { id: 4, courseName: 'Vue',     instructorName: 'Omar', category: 'Frontend', duration: 12, price: 1000, status: 'Active',   createdDate: '2026-01-04' },
  { id: 5, courseName: 'Python',  instructorName: 'Nour', category: 'Backend',  duration: 25, price: 1800, status: 'Active',   createdDate: '2026-01-05' },
  { id: 6, courseName: 'Django',  instructorName: 'Hana', category: 'Backend',  duration: 22, price: 1600, status: 'Draft',    createdDate: '2026-01-06' },
];

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let mockCourseService: jasmine.SpyObj<CourseService>;

  beforeEach(async () => {
    mockCourseService = jasmine.createSpyObj('CourseService', ['getAll', 'delete']);
    mockCourseService.getAll.and.returnValue(of([...mockCourses]));

    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [
        provideRouter([]),
        { provide: CourseService, useValue: mockCourseService },
        ToastService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('loads courses on init', () => {
    expect(mockCourseService.getAll).toHaveBeenCalled();
    expect(component.courses.length).toBe(6);
  });

  describe('filteredCourses', () => {
    it('returns all courses when no filter is set', () => {
      expect(component.filteredCourses.length).toBe(6);
    });

    it('filters by search term (case-insensitive)', () => {
      component.searchTerm = 'ang';
      expect(component.filteredCourses.length).toBe(1);
      expect(component.filteredCourses[0].courseName).toBe('Angular');
    });

    it('filters by status', () => {
      component.setFilter('Active');
      expect(component.filteredCourses.every(c => c.status === 'Active')).toBeTrue();
    });

    it('combines search and status filter', () => {
      component.searchTerm = 'backend';
      component.setFilter('Active');
      expect(component.filteredCourses.every(c => c.status === 'Active')).toBeTrue();
    });
  });

  describe('sorting', () => {
    it('sorts asc by courseName', () => {
      component.sortBy('courseName');
      const names = component.sortedCourses.map(c => c.courseName);
      expect(names).toEqual([...names].sort());
    });

    it('toggles to desc when same key is clicked twice', () => {
      component.sortBy('price');
      component.sortBy('price');
      expect(component.sortDirection).toBe('desc');
      const prices = component.sortedCourses.map(c => c.price);
      expect(prices[0]).toBeGreaterThanOrEqual(prices[prices.length - 1]);
    });

    it('resets direction to asc when switching key', () => {
      component.sortBy('price');
      component.sortBy('price'); // now desc
      component.sortBy('courseName'); // new key → back to asc
      expect(component.sortDirection).toBe('asc');
    });

    it('sortIcon returns "sort" for inactive column', () => {
      component.sortKey = 'price';
      expect(component.sortIcon('courseName')).toBe('sort');
    });

    it('sortIcon returns "up" for active asc column', () => {
      component.sortBy('price');
      expect(component.sortIcon('price')).toBe('up');
    });

    it('sortIcon returns "down" for active desc column', () => {
      component.sortBy('price');
      component.sortBy('price');
      expect(component.sortIcon('price')).toBe('down');
    });
  });

  describe('pagination', () => {
    it('visibleCourses returns only the current page slice', () => {
      expect(component.visibleCourses.length).toBe(component.pageSize);
    });

    it('totalPages is calculated correctly', () => {
      expect(component.totalPages).toBe(Math.ceil(6 / component.pageSize));
    });

    it('goToPage clamps to valid range', () => {
      component.goToPage(0);
      expect(component.currentPage).toBe(1);

      component.goToPage(999);
      expect(component.currentPage).toBe(component.totalPages);
    });

    it('onSearchChange resets to page 1', () => {
      component.currentPage = 2;
      component.onSearchChange();
      expect(component.currentPage).toBe(1);
    });

    it('setFilter resets to page 1', () => {
      component.currentPage = 2;
      component.setFilter('Draft');
      expect(component.currentPage).toBe(1);
    });
  });
});
