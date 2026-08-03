import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  const stored = sessionStorage.getItem('auth_user');
  let token: string | null = null;
  
  if (stored) {
    try {
      const user = JSON.parse(stored);
      token = user?.accessToken;
    } catch {
      console.log('failed to parse');
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
        sessionStorage.removeItem('auth_user');
        router.navigate(['/login']);
      }
      // console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
