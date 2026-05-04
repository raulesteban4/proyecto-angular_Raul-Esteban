import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { GestionarUsuarios } from './servicios/gestionar-usuarios';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const auth = inject(GestionarUsuarios);
  const router = inject(Router);
  const token = auth.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({ 
      headers: req.headers.set('Authorization', `Bearer ${token}`),
      withCredentials: true
    });
  } else {
    authReq = req.clone({ withCredentials: true });
  }

  return next(authReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        auth.logout().subscribe({
          next: () => {
            router.navigate(['/login']);
          }
        });
      }
      return throwError(() => err);
    })
  );
}
