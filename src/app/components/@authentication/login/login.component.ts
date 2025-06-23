import { Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { timer } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../../services/authentication.service';
import { MarketingService } from '../../../services/marketing.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RoutesPipe } from '../../../pipes/routes.pipe';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    FormsModule,
    RouterModule,
    CarouselModule,
    MatMenuModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  close() {
    throw new Error('Method not implemented.');
  }
  hidePassword = true;
  public submitted = false;
  showImage: boolean = true;
  lang = this.translocoService.getActiveLang();

  public form: FormGroup = this.formbuilder.group({
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(11),
        Validators.maxLength(11),
      ],
    ],
    password: ['', Validators.required],
    rememberMe: [false, Validators.nullValidator],
  });

  constructor(
    private formbuilder: FormBuilder,
    public dialog: MatDialog,
    private service: AuthenticationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private mktService: MarketingService,
    private translocoService: TranslocoService,
    private route: RoutesPipe
  ) {
    timer(4000).subscribe(() => (this.showImage = false));
  }

  get f() {
    return this.form.controls;
  }
  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    this.spinner.show();
    var form = {
      Phone: this.form.value.phone,
      Password: this.form.value.password,
      UserTypeId: 3,
    };
    this.service.login(form).subscribe((res: any) => {
      this.spinner.hide();
      const eventData: any = this.mktService.setEventData(
        'New Login By Patient',
        `Login`,
        'Login'
      );
      this.mktService.onEventFacebook(eventData);
      if (res.ProfileStatus == 0 || res.ProfileStatus == 1) {
        Swal.fire({
          icon: 'warning',
          title: 'Please complete your profile',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.router.navigate([this.route.transform('personal-info')]);
        });
      }
      this.router.navigate([this.route.transform('home')]);
      this.dialogRef.close();
      setTimeout(() => {
        this.service.currentUserSubject.next(res);
      }, 5000);
    });
  }
  showHidePassword() {
    this.hidePassword = !this.hidePassword;
  }
  dialogRef = inject(MatDialogRef);

  closeDialog() {
    this.dialogRef.close();
  }
  forgetPassword() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '400px',
      height: 'auto',
      data: {},
    });
    this.dialogRef.close();
  }
  signUp() {
    this.dialog.open(SignUpComponent, {
      width: '430px',
      height: 'auto',
      data: {},
    });
     this.dialogRef.close();
  }
}
