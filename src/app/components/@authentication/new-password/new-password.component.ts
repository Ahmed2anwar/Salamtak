import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CodeInputModule } from 'angular-code-input';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../../services/authentication.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RoutesPipe } from '../../../pipes/routes.pipe';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { ResetSuccessfullyComponent } from '../reset-successfully/reset-successfully.component';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    TranslocoModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CodeInputModule,
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent {
  hidePassword = true;
  public submitted = false;
  dialogRef = inject(MatDialogRef);
  token: string | null = null;
  lang = this.translocoService.getActiveLang();
  public form: FormGroup = this.formbuilder.group({
    password: ['', Validators.required, Validators.minLength(6)],
    confirmPassword: ['', Validators.required],
  });

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private routerNavigater: ActivatedRoute,
    private service: AuthenticationService,
    private spinner: NgxSpinnerService,
    private StorageService: LocalStorageService,
    private translocoService: TranslocoService,
    private route: RoutesPipe
  ) {}

  ngOnInit() {
    this.token = this.routerNavigater.snapshot.paramMap.get('token');
    console.log('Received token:', this.token);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  get f() {
    return this.form.controls;
  }
  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      // window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    if (this.form.value.password != this.form.value.confirmPassword) {
      // alert('Password and confirm password not matched')
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Password and confirm password not matched',
        // footer: '<a href>Why do I have this issue?</a>'
      });
      return;
    }

    const form = {
      UserId: Number(this.StorageService.getItem('reset-password-user-id')),
      Password: this.form.value.password,
      OldPassword: '',
    };
    this.spinner.show();
    this.service.updatePassword(form).subscribe((res) => {
      this.spinner.hide();
      this.dialog.open(ResetSuccessfullyComponent, {
        width: '400px',
        height: 'auto',
        data: {},
      });
    });
    this.dialogRef.close();
  }

  showHidePassword() {
    this.hidePassword = !this.hidePassword;
  }
}
