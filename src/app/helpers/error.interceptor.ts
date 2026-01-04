import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';


export function ErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

  const auth = inject(AuthenticationService);
  const dialog = inject(MatDialog);
  const spinner = inject(NgxSpinnerService);
  const platformId = inject(PLATFORM_ID);

  const isBrowser = isPlatformBrowser(platformId);

  return next(req).pipe(
    catchError(err => {

      if (isBrowser) {
        spinner.hide();
      }

      // Timeout
      if (err.name === 'TimeoutError') {
        if (isBrowser) Swal.fire('Error !', 'Connection Timeout !', 'error');
        return throwError(() => err);
      }

      switch (err.status) {
        case 400:
          if (isBrowser) {
            if (err.error?.Message) {
              Swal.fire('Error !', err.error.Message, 'error');
            }

            if (err.error?.errors) {
              for (let i in err.error.errors) {
                Swal.fire('Error !', err.error.errors[i], 'error');
              }
            }
          }
          break;

        case 401:
          if (isBrowser) Swal.fire('Error !', 'Unauthorized access !', 'error');
          auth.logout();
          break;
      }

      return throwError(() => err);
    })
  );
}
