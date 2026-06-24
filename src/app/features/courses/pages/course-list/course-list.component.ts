import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course, CourseStatus } from '../../models/course.model';
import { DeleteConfirmModalComponent } from '../../components/delete-confirm-modal/delete-confirm-modal.component';
import { ToastService } from '../../../../shared/toast/toast.service';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';

type SortKey = 'id' | 'courseName' | 'instructorName' | 'category' | 'duration' | 'price' | 'status' | 'createdDate';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DeleteConfirmModalComponent, PaginationComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  searchTerm = '';
  selectedStatus: CourseStatus | 'All' = 'All';
  courseToDelete: Course | null = null;
  isLoading = true;
  sortKey: SortKey = 'createdDate';
  sortDirection: SortDirection = 'desc';
  currentPage = 1;
  readonly pageSize = 5;
  readonly skeletonRows = Array.from({ length: 5 });
  readonly statusFilters: Array<CourseStatus | 'All'> = ['All', 'Active', 'Draft', 'Archived'];

  constructor(
    private courseService: CourseService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;

    this.courseService.getAll().subscribe({
      next: courses => {
        this.courses = courses;
        this.clampPage();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show('Could not load courses.', 'error');
      },
    });
  }

  get filteredCourses(): Course[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.courses.filter(course => {
      const haystack = `${course.courseName} ${course.instructorName} ${course.category}`.toLowerCase();
      const matchesSearch = haystack.includes(term);
      const matchesStatus = this.selectedStatus === 'All' || course.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  get sortedCourses(): Course[] {
    return [...this.filteredCourses].sort((a, b) => {
      const left = a[this.sortKey];
      const right = b[this.sortKey];
      const direction = this.sortDirection === 'asc' ? 1 : -1;

      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * direction;
      }

      return String(left).localeCompare(String(right)) * direction;
    });
  }

  get visibleCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedCourses.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedCourses.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get rangeStart(): number {
    return this.sortedCourses.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.sortedCourses.length);
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  setFilter(status: CourseStatus | 'All'): void {
    this.selectedStatus = status;
    this.currentPage = 1;
  }

  sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }

  sortIcon(key: SortKey): string {
    if (this.sortKey !== key) return 'sort';
    return this.sortDirection === 'asc' ? 'up' : 'down';
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  viewCourse(id: number): void {
    this.router.navigate(['/courses', id]);
  }

  editCourse(id: number): void {
    this.router.navigate(['/courses', id, 'edit']);
  }

  confirmDelete(course: Course): void {
    this.courseToDelete = course;
  }

  onDeleteConfirmed(): void {
    if (!this.courseToDelete) return;

    const courseName = this.courseToDelete.courseName;

    this.courseService.delete(this.courseToDelete.id).subscribe({
      next: () => {
        this.loadCourses();
        this.courseToDelete = null;
        this.toastService.show(`${courseName} deleted successfully`);
      },
      error: () => {
        this.toastService.show(`Could not delete ${courseName}`, 'error');
      },
    });
  }

  onDeleteCancelled(): void {
    this.courseToDelete = null;
  }

  private clampPage(): void {
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }
}
