// verification-code.component.ts
import {
  Component,
  Inject,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RoutesPipe } from '../../../pipes/routes.pipe';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { NewPasswordComponent } from '../new-password/new-password.component';

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
export class VerificationCodeComponent implements OnInit, OnDestroy {
  codeCompleted = false;
  subject = new Subject();
  phone = '';
  fromPage = '';
  form: any;
  r = '';
  codeLength = 0;
  from = '';
  intervalId: any = null; // will hold setInterval id
  message: string | null = ''; // formatted mm:ss or null when timer expired
  code = this.StorageService.getItem('auth-verification-code');
  seconds = 0; // remaining seconds
  keyUpCode: any = null;
  registerForm = JSON.parse(
    this.StorageService.getItem('sign-up-first-step') || '{}'
  );
  lang = this.translocoService.getActiveLang();
public isBrowser: boolean = isPlatformBrowser(this.platformId);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private StorageService: LocalStorageService,
    private dialogRef: MatDialogRef<VerificationCodeComponent>,
    private formbuilder: FormBuilder,
    private router: Router,
    private service: AuthenticationService,
    private spinner: NgxSpinnerService,
    private translocoService: TranslocoService,
    public dialog: MatDialog,
    private route: RoutesPipe
  ) {}

  ngOnInit() {
    try {
      const encodedData = this.data?.r;
      if (encodedData) {
        const decodedData = atob(encodedData);
        const jsonString = decodeURIComponent(escape(decodedData));
        this.form = JSON.parse(jsonString);
      } else {
        this.form = this.data?.form || {};
      }
      this.phone = this.data?.p || '';
      this.fromPage = this.data?.from || '';
      this.r = this.data?.r || '';
      const code = String(this.form?.['Code'] ?? '');
      this.codeLength = code.length;
      this.seconds = this.normalizeSeconds(this.form?.['ReSendCounter']);
      this.start();
    } catch (error) {
      console.error('Error processing verification code data:', error);
      this.seconds = 15 * 60;
      this.start();
    }
  }
  ngOnDestroy() {
    this.clearTimer();
  }
  private normalizeSeconds(value: any): number {
    const DEFAULT_SEC = 15 * 60; // 900 seconds
    if (value == null || value === '' || isNaN(Number(value))) {
      return DEFAULT_SEC;
    }
    const num = Number(value);
    if (num > 1000) {
      const sec = Math.floor(num / 1000);
      return sec > 0 ? sec : DEFAULT_SEC;
    }
    if (num <= 0) {
      return DEFAULT_SEC;
    }
    return Math.floor(num);
  }
  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

 private countDown() {
  if (!this.isBrowser) return;
  this.clearTimer();
  if (!this.seconds || isNaN(this.seconds) || this.seconds <= 0) {
    this.seconds = 15 * 60; // default to 15 minutes
  }
  this.message = this.formatTime(this.seconds);
  this.intervalId = window.setInterval(() => {
    this.seconds -= 1;
    if (this.seconds <= 0) {
      this.clearTimer();
      this.message = null;
      this.seconds = 15 * 60;
      return;
    }
    this.message = this.formatTime(this.seconds);
  }, 1000);
}


  ngOnDestroyTimerSafe() {
    this.clearTimer();
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

  verify() {
    this.code = this.StorageService.getItem('auth-verification-code');
    if (String(this.keyUpCode).trim() === String(this.code).trim()) {
      this.spinner.show();
      if (this.fromPage === 'forgot-password') {
        const token = this.r;
        this.dialog.open(NewPasswordComponent, {
          width: '400px',
          height: 'auto',
          data: { token: token },
        });
        this.spinner.hide();
        this.dialogRef.close();
        return;
      }
      this.service.createUser(this.registerForm).subscribe((res: any) => {
        this.StorageService.setItem('new-user', true);
        this.router
          .navigate(['/en/profile'], {
            queryParams: { redirect: 'reset-successfully' },
          })
          .then(() => {
            this.spinner.hide();
            this.dialogRef.close();
          });
      });
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
  }

  reSendCode() {
    this.start();

    if (this.fromPage === 'forgot-password') {
      const isEmail = (email: string) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      const form = {
        ResetMethod: isEmail(this.phone) ? 1 : 2,
        Phone: isEmail(this.phone) ? '' : this.phone,
        Email: isEmail(this.phone) ? this.phone : '',
        UserTypeId: 3,
      };
      this.service.ResetPassword(form).subscribe((res: any) => {
        this.StorageService.setItem(
          'reset-password-user-id',
          res?.Data?.UserId
        );
        this.form = res.Data;
        this.code = this.form.Code;
        Swal.fire({
          icon: 'success',
          title: 'Done',
          text: 'Verification code sent successfully!',
        });

        this.spinner.hide();
      });
      return;
    }

    const userRegisterFirstStep = this.registerForm;
    this.spinner.show();
    this.service.signup(userRegisterFirstStep).subscribe((res: any) => {
      this.StorageService.setItem('auth-verification-code', res.Data.Code);
      const encoded = btoa(
        unescape(encodeURIComponent(JSON.stringify(res.Data)))
      );
      this.form = res.Data;

      // normalize ReSendCounter from server (if present) and restart timer
      this.seconds = this.normalizeSeconds(this.form?.['ReSendCounter']);
      this.start();

      this.router.navigate([this.route.transform('verification-code')], {
        queryParams: {
          r: encoded,
          p: this.phone,
        },
      });
      this.spinner.hide();
    });
  }

  start() {
    this.countDown();
  }

  stop() {
    this.clearTimer();
    // show formatted current time (or null)
    this.message = this.seconds > 0 ? this.formatTime(this.seconds) : null;
  }

  private clearTimer() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
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
