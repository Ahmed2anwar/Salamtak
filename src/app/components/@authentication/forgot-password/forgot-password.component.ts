import { Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonModule, Location } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RoutesPipe } from '../../../pipes/routes.pipe';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { VerificationCodeComponent } from '../verification-code/verification-code.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    TranslocoModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {

  public submitted = false;
  lang = this.translocoService.getActiveLang();
  public form: FormGroup = this.formbuilder.group({
    email_or_phone: ['', [Validators.required]],
    // email or phone validation pattern regexz
  });
  location = inject(Location);
  dialogRef = inject(MatDialogRef);


  constructor(
    public dialog: MatDialog,
    private formbuilder: FormBuilder,
    private router: Router,
    private auth: AuthenticationService,
    private spinner: NgxSpinnerService,
    private translocoService: TranslocoService,
    private StorageService: LocalStorageService,
    private route: RoutesPipe
  ) {}

  get f() {
    return this.form.controls;
  }
  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    var form;
    if (this.form.value.email_or_phone.includes('@')) {
      // Email
      form = {
        ResetMethod: 1,
        Email: this.form.value.email_or_phone,
        UserTypeId: 3,
      };
    } else {
      // Phone
      form = {
        ResetMethod: 2,
        Phone: this.form.value.email_or_phone,
        UserTypeId: 3,
      };
    }

    this.spinner.show();
    this.auth.ResetPassword(form).subscribe((res: any) => {
      this.StorageService.setItem(
        'reset-password-user-id',
        res['Data']['UserId']
      );
      this.spinner.hide();
      this.StorageService.setItem(
        'auth-verification-code',
        res['Data']['Code']
      );
      const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(res.Data))));

      this.dialog.open(VerificationCodeComponent, {
        width: '400px',
        height: 'auto',
        data: {
          r: encodedData,
          p: this.form.value.email_or_phone,
          from: 'forgot-password',
        },
      });

    });
    this.dialogRef.close();
  }


  PreviousPage() {
    this.dialog.open(LoginComponent, {
      width: '450px',
      height: 'auto',
      data: {},
    });
    this.dialogRef.close();
  }
  // open forget password component Dialog
  forgetPassword() {
    
    this.dialog.open(ForgotPasswordComponent, {
      width: '450px',
      height: 'auto',
      data: {},
    });
    this.dialogRef.close();
  }
}
