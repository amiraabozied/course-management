import { Routes } from '@angular/router';
import { courseExistsGuard } from './features/courses/guards/course-exists.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/pages/course-list/course-list.component').then(
        m => m.CourseListComponent
      ),
  },
  {
    path: 'courses/add',
    loadComponent: () =>
      import('./features/courses/pages/course-form/course-form.component').then(
        m => m.CourseFormComponent
      ),
  },
  {
    path: 'courses/:id/edit',
    canActivate: [courseExistsGuard],
    loadComponent: () =>
      import('./features/courses/pages/course-form/course-form.component').then(
        m => m.CourseFormComponent
      ),
  },
  {
    path: 'courses/:id',
    canActivate: [courseExistsGuard],
    loadComponent: () =>
      import('./features/courses/pages/course-details/course-details.component').then(
        m => m.CourseDetailsComponent
      ),
  },
  { path: '**', redirectTo: '/courses' },
];
