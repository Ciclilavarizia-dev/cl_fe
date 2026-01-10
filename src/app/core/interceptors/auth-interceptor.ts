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
      
      /**
       * quando l'url contiene ancora '/Auth/Refresh'
       * imposta SetJwtInfo a false per invalidare l'info del Jwt
       * o segnalare che non è autenticato. Questo impedisce
       * di mandare altre richieste di resfresh token e non creare loop 
       * infinite di errori 401
       */
      if (req.url.includes('/Auth/Refresh')) {
        authService.SetJwtInfo(false, '');
        return throwError(() => error);
      }

      if (error.status === 401) {
        console.warn(
          '%c[INTERCEPTOR] Access token has expired... refresh token request sent',
          'color: orange; font-weight: bold;'
        );

        return authService.refreshToken().pipe(
          switchMap((newToken: string) => {
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
