import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService); // replaces constructor injection

  const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Prevent infinite refresh loop
      if (req.url.includes('/Auth/Refresh')) {
        console.error(
          '%c[INTERCEPTOR] Refresh failed → logging out.',
          'color: red; font-weight: bold;'
        );

        authService.SetJwtInfo(false, '');
        return throwError(() => error);
      }

      if (error.status === 401) {
        console.warn(
          '%c[INTERCEPTOR] 401 detected → attempting refresh...',
          'color: orange; font-weight: bold;'
        );

        return authService.refreshToken().pipe(
          switchMap((newToken: string) => {
            console.log(
              '%c[INTERCEPTOR] New access token received → retrying original request.',
              'color: green; font-weight: bold;'
            );

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
