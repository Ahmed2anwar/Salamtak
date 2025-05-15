import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CountryISO } from 'ngx-intl-tel-input';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { MustMatch } from '../../../helpers/must-match.validator';
import { AuthenticationService } from '../../../services/authentication.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RoutesPipe } from '../../../pipes/routes.pipe';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-sign-up',
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
    NgxMatIntlTelInputComponent,
    RoutesPipe,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  @ViewChild('phone_number', { static: true })
  phoneNumberInput!: NgxMatIntlTelInputComponent;
  hidePassword = true;
  CountryISO = CountryISO;
  base64 = '';
  @ViewChild(NgxMatIntlTelInputComponent, { static: true })
  private phoneComponent: any;
  @ViewChild('FullNameEnInput') FullNameEnInput: any;
  lang = this.translocoService.getActiveLang();
  public submitted = false;
  public form: FormGroup = this.formbuilder.group(
    {
      // FullNameEn:['',Validators.required],
      FullNameEn: ['', [Validators.required, this.customValidator()]], // FullNameAr:['',Validators.required],
      FullNameAr: ['', [Validators.required, this.arabicThreeWordsValidator()]],
      Phone: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/), // Updated pattern
        ],
      ],
      ConfirmPassword: ['', [Validators.required]],
      image: ['', Validators.nullValidator],
      Terms: ['', Validators.nullValidator],
    },
    { validator: MustMatch('Password', 'ConfirmPassword') }
  );

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private formbuilder: FormBuilder,
    private service: AuthenticationService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private translocoService: TranslocoService,
    private elementRef: ElementRef,
    private StorageService: LocalStorageService,
    private route: RoutesPipe
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    const inputElement = this.elementRef.nativeElement.querySelector(
      '.ngx-mat-intl-tel-input input'
    );
    if (inputElement) {
      inputElement.placeholder = 'Enter your mobile here';
    }
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
    this.form.value.Phone = this.phoneComponent.numberInstance.nationalNumber;
    this.spinner.show();
    this.form.value.image = this.base64;
    this.service.signup(this.form.value).subscribe((res: any) => {
      this.StorageService.setItem(
        'sign-up-first-step',
        JSON.stringify(this.form.value)
      );

      this.StorageService.setItem(
        'currentUser',
        JSON.stringify(this.form.value)
      );

      this.StorageService.setItem('auth-verification-code', res.Data.Code);

      res = btoa(unescape(encodeURIComponent(JSON.stringify(res.Data))));
      // this.router.navigate([`/${this.lang}/auth/verification-code`],
      this.router.navigate([this.route.transform('verification-code')], {
        queryParams: {
          // response
          r: res,
          // phone number
          p: this.form.value.Phone,
        },
      });
      this.spinner.hide();
    });
  }
  showHidePassword() {
    this.hidePassword = !this.hidePassword;
  }
  hanedlFileInput(e: any) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64 = reader.result as string;
      this.form.patchValue({
        image: this.base64,
      });
    };
  }

  customValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value: any = control.value || '';

      if (!value) {
        return { required: true }; // Return required error if the field is empty
      } else if (!/^[a-zA-Z ]*$/.test(value)) {
        return { pattern: true }; // Return pattern error if non-English characters are entered
      } else if (value.split(' ').length < 3) {
        return { space: true }; // Return space error if the input does not contain three words
      }

      return null; // Return null if no error
    };
  }
  elevenDigitNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;

      // Check if the value is a number and has exactly 11 digits
      if (!/^\d{11}$/.test(value)) {
        return { invalidNumber: true };
      }

      return null;
    };
  }
  arabicThreeWordsValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value: string = control.value;

      if (!value) {
        return { required: true }; // Return required error if the field is empty
      } else if (!/[\u0600-\u06FF]/.test(value)) {
        return { pattern: true }; // Return pattern error if non-Arabic characters are entered
      } else if (value.split(' ').length < 3) {
        return { space: true }; // Return space error if the input does not contain three words
      }

      return null; // Return null if no error
    };
  }
  emailValidator(control: FormControl) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(control.value);

    if (!isValid) {
      return { invalidEmail: true };
    }

    const domain = control.value.split('@')[1];
    if (domain) {
      const validDomains = ['com', 'org', 'net', 'edu']; // Add more valid domains as needed
      const isValidDomain = validDomains.some((validDomain) =>
        domain.includes(validDomain)
      );

      if (!isValidDomain) {
        return { invalidDomain: true };
      }
    }

    return null;
  }

  dialogRef = inject(MatDialogRef); // ✅ inject dialog reference

  closeDialog() {
    this.dialogRef.close(); // ✅ method to close the dialog
  }
  login() {
    this.dialog.open(LoginComponent, {
      width: '400px',
      height: 'auto',
      data: {},
    });
    this.dialogRef.close();
  }
}
