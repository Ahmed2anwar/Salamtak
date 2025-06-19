import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHandlerFn, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// import { ToastrService } from 'ngx-toastr';
// import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimeoutComponent } from '../shared/timeout/timeout.component';
// import { AuthenticationService } from '../auth/authentication.service';
// declare var toastr: any;


export function ErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    // const toastr = inject(ToastrService);
    const service = inject(AuthenticationService);
    const dialog = inject(MatDialog);
    const spinner = inject(NgxSpinnerService);
    return next(req).pipe( catchError(err => {
      spinner.hide()

      if(err.name == 'TimeoutError'){
        // this.dialog.open(TimeoutComponent,
        // {
        //   // disableClose: true,
        // });
        Swal.fire('Error !', 'Connection Timeout !', 'error')

        return throwError(err);
      }
      switch (err.status) {
        case 400:

          console.log(err)
          console.log(err.error)
          if(err.error['Message']){
            Swal.fire('Error !', err.error.Message, 'error')
          }
          if(err.error.errors){
            for (var i in err.error.errors) {
              Swal.fire('Error !', err.error.errors[i], 'error')
            }
          }
          break;
        case 401:
        Swal.fire('Error !', 'Sign up first !', 'error')
          service.logout()
          break;
      }

        const error = err.error.message || err.statusText;

        return throwError(err);
    }))
  }
