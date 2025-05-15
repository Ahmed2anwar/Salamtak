import { Component, inject, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RoutesPipe } from '../../../pipes/routes.pipe';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-verification-code',
  standalone: true,
  imports: [
    TranslocoModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CodeInputModule,
  ],
  templateUrl: './verification-code.component.html',
  styleUrl: './verification-code.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VerificationCodeComponent {
  codeCompleted = false;
  subject = new Subject();
  phone = '';
  fromPage = '';
  form: any;
  r = '';
  codeLength = 0;
  from = '';
  dialogRef = inject(MatDialogRef);
  // ReSendCounter = 0;
  intervalId = 0;
  message: any = '';
  code = this.StorageService.getItem('auth-verification-code');
  seconds = 0;
  keyUpCode = null;
  registerForm = JSON.parse(
    this.StorageService.getItem('sign-up-first-step') || '{}'
  );
  lang = this.translocoService.getActiveLang();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // receive passed data here
    private StorageService: LocalStorageService,
    private formbuilder: FormBuilder,
    private router: Router,
    private service: AuthenticationService,
    private spinner: NgxSpinnerService,
    private translocoService: TranslocoService,
    public dialog: MatDialog,

    private route: RoutesPipe
  ) {
    this.router.parseUrl(this.router.url).queryParams['r'];
    this.router.parseUrl(this.router.url).queryParams['p'];
    this.from = this.router.parseUrl(this.router.url).queryParams['from'];
    this.r = this.router.parseUrl(this.router.url).queryParams['r'];
  }
  onCodeChanged(e: any) {
    this.codeCompleted = false;
    this.keyUpCode = null;
  }
  onCodeCompleted(e: any) {
    this.codeCompleted = true;
    this.keyUpCode = e;
    this.verify();
  }
  // on init
  ngOnInit() {
    try {
      const encodedData = this.data?.r;
      const decodedData = atob(encodedData);
      const jsonString = decodeURIComponent(escape(decodedData));
      this.form = JSON.parse(jsonString);

      this.phone = this.data?.p;
      this.fromPage = this.data?.from;

      let code = String(this.form['Code']);
      this.codeLength = code.length;
      this.seconds = this.form['ReSendCounter'];

      this.start();
    } catch (error) {
      console.error('Error processing data:', error);
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  start() {
    this.countDown();
  }
  stop() {
    this.clearTimer();
    this.message = `${this.seconds}s`;
  }

  private clearTimer() {
    clearInterval(this.intervalId);
  }

  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;
      if (this.seconds === 0) {
        this.message = null;
        this.clearTimer();
        return;
      } else {
        if (this.seconds < 0) {
          this.seconds = 120;
        } // reset
        this.message = `${this.seconds}s`;
      }
    }, 1000);
  }
  verify() {
    //

    this.code = this.StorageService.getItem('auth-verification-code');
    if (this.keyUpCode == this.code) {
      this.spinner.show();
      if (this.fromPage == 'forgot-password') {
        // عدم معرفه الرابط الصحيح للتحويل للصفحة الخاصة بتغيير كلمة المرور
        // this.router.navigate([`/${this.lang}/auth/new-password`,this.r])
        this.router.navigate([
          this.route.transform('new-password') + `/${this.r}`,
        ]);
        this.spinner.hide();
        return;

        return;
      }

      this.service.createUser(this.registerForm).subscribe((res: any) => {
        // this.router.navigate([`/${this.lang}/profile`],{queryParams: {redirect: `/${this.lang}/auth/reset-successfully`}}).then(() => {
        this.StorageService.setItem('new-user', true);
        this.router
          .navigate([this.route.transform('profile')], {
            queryParams: {
              redirect: this.route.transform('reset-successfully'),
            },
          })
          .then(() => {
            // To solve the problem of not adding the user to the service - temporarily
            // window.location.reload();
            this.spinner.hide();
          });
      });

      // this.router.navigate(['/auth/reset-successfully'])
    } else {
      Swal.fire({
        icon: 'error',
        title: this.translocoService.translate(
          'authentication.verification-code.opps'
        ),
        text: this.translocoService.translate(
          'authentication.verification-code.mess'
        ),
      });
    }

    // let  = this.form['Code'];
    // this.router.navigate(['/auth/reset-successfully'])
  }
  reSendCode() {
    this.start();

    if (this.fromPage == 'forgot-password') {
      function isEmail(email: any) {
        var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(email);
      }
      // remove 0 from phone number
      // if(this.phone[0] == '0'){
      //   this.phone = this.phone.substring(1)
      // }
      var form: any = {
        ResetMethod: 2, // 2 for phone , 1 for email
        Phone: this.phone,
        Email: '',
        UserTypeId: 3,
      };
      if (isEmail(this.phone)) {
        (form.ResetMethod = 1), (form.Email = this.phone), (form.Phone = '');
        form.UserTypeId = 3;
      }
      this.service.ResetPassword(form).subscribe((res: any) => {
        // let res = btoa(unescape(encodeURIComponent(JSON.stringify(res.Data))));
        this.StorageService.setItem(
          'reset-password-user-id',
          res['Data']['UserId']
        );
        this.form = res.Data;
        Swal.fire({
          icon: 'success',
          title: 'Done',
          text: 'Verification code sent successfully !',
        });
        this.code = this.form.Code;
        // this.router.navigate(['/auth/new-password',this.r],
        // {
        //   queryParams: {
        //     r:res,
        //     p:this.phone
        //   }
        // })
        this.spinner.hide();
      });
      return;
    }
    let userRegisterFirstStep = this.registerForm;
    this.spinner.show();
    this.service.signup(userRegisterFirstStep).subscribe((res: any) => {
      this.StorageService.setItem('auth-verification-code', res.Data.Code);
      res = btoa(unescape(encodeURIComponent(JSON.stringify(res.Data))));
      this.form = res.Data;
      // this.router.navigate([`/${this.lang}/auth/verification-code`],
      this.router.navigate([this.route.transform('verification-code')], {
        queryParams: {
          r: res,
          p: this.phone,
        },
      });
      this.spinner.hide();
    });
  }

  PreviousPage() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '400px',
      height: 'auto',
      data: {},
    });
    this.dialogRef.close();
  }
}
