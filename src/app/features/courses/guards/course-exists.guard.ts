import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { ToastService } from '../../../shared/toast/toast.service';

export const courseExistsGuard: CanActivateFn = route => {
  const router = inject(Router);
  const courseService = inject(CourseService);
  const toastService = inject(ToastService);
  const id = Number(route.paramMap.get('id'));

  if (!Number.isFinite(id)) {
    toastService.show('Course not found', 'error');
    return router.createUrlTree(['/courses']);
  }

  return courseService.getById(id).pipe(
    map(() => true),
    catchError(() => {
      toastService.show('Course not found', 'error');
      return of(router.createUrlTree(['/courses']));
    })
  );
};