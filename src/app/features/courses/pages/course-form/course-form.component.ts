import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseFormData, CourseStatus } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { ToastService } from '../../../../shared/toast/toast.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  courseId: number | null = null;
  isEditMode = false;
  submitted = false;
  statusDropdownOpen = false;
  readonly statuses: CourseStatus[] = ['Active', 'Draft', 'Archived'];

  form: CourseFormData = {
    courseName: '',
    instructorName: '',
    category: '',
    duration: 1,
    price: 0,
    status: 'Active',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    const id = Number(idParam);

    this.courseService.getById(id).subscribe({
      next: course => {
        this.courseId = id;
        this.isEditMode = true;
        this.form = {
          courseName: course.courseName,
          instructorName: course.instructorName,
          category: course.category,
          duration: course.duration,
          price: course.price,
          status: course.status,
          description: course.description,
        };
      },
      error: () => {
        this.toastService.show('Course not found', 'error');
        this.router.navigate(['/courses']);
      },
    });
  }

  selectStatus(status: CourseStatus): void {
    this.form.status = status;
    this.statusDropdownOpen = false;
  }

  save(courseForm: NgForm): void {
    this.submitted = true;

    if (courseForm.invalid) {
      courseForm.control.markAllAsTouched();
      this.toastService.show('Please fix the highlighted fields', 'error');
      return;
    }

    const request$ = this.isEditMode && this.courseId !== null
      ? this.courseService.update(this.courseId, this.form)
      : this.courseService.create(this.form);

    request$.subscribe({
      next: () => {
        this.toastService.show(this.isEditMode ? 'Course updated successfully' : 'Course added successfully');
        this.router.navigate(['/courses']);
      },
      error: () => {
        this.toastService.show('Could not save course.', 'error');
      },
    });
  }
}
