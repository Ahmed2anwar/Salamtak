import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginComponent } from '../components/@authentication/login/login.component';

export function ErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const service = inject(AuthenticationService);
  const dialog = inject(MatDialog);
  const spinner = inject(NgxSpinnerService);

  return next(req).pipe(
    catchError((err) => {
      spinner.hide();

      if (err.name === 'TimeoutError') {
        Swal.fire('Error!', 'Connection Timeout!', 'error');
        return throwError(() => err);
      }

      switch (err.status) {
        case 400:
          if (err.error?.Message) {
            Swal.fire('Error!', err.error.Message, 'error');
          }
          if (err.error?.errors) {
            for (const i in err.error.errors) {
              Swal.fire('Error!', err.error.errors[i], 'error');
            }
          }
          break;

        case 401:
          Swal.fire({
            title: 'Error!',
            text: 'Sign up first before you book!',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              service.logout();
              dialog.open(LoginComponent, {
                width: '400px',
                height: 'auto',
              });
            }
          });
          break;
      }

      const error = err.error?.message || err.statusText;
      return throwError(() => error);
    })
  );
}
