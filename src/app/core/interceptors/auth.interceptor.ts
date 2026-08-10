import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AUTH_STORAGE_KEY } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
  let token: string | null = null;

  if (stored) {
    try {
      const user = JSON.parse(stored);
      token = user?.accessToken;
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        router.navigate(['/login']);
        // console.log('Unauthorized access - redirecting to login');
      }
      return throwError(() => error);
    })
  );
};
