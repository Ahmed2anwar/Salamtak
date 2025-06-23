import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MarketingService } from '../../../../services/marketing.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { RoutesPipe } from '../../../../pipes/routes.pipe';

@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    MatMenuModule,
    FormsModule,
    CommonModule,
    RoutesPipe,
  ],
  templateUrl: './first-step.component.html',
  styleUrl: './first-step.component.scss',
})
export class FirstStepComponent {
  // #saveChanges
  @ViewChild('saveChanges') saveChanges: any;

  CountryISO = CountryISO;
  @ViewChild(NgxMatIntlTelInputComponent, { static: true })
  private phoneComponent: any;
  public countries: any;
  public occupations: any;
  public patient: any;
  public formSubmitted: any = false;
  public user: any;
  public gen: any;
  lang = this.translocoService.getActiveLang();
  public form: any = this.formbuilder.group({
    image: ['', Validators.nullValidator],
    FullNameEn: ['', [Validators.required, this.customValidator()]],
    FullNameAr: ['', [Validators.required, this.arabicThreeWordsValidator()]],

    // غير مفعل حاليا
    // phone max length 11
    // Phone:['',[Validators.required,Validators.maxLength(11)]],
    // Email:['',[Validators.required,Validators.email]],
    gender: ['', Validators.required],
    day: ['', Validators.required],
    month: ['', Validators.required],
    year: ['', Validators.required],
    Nationality: ['', Validators.required],
    Occupation: [''],
  });

  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: AuthenticationService,
    private spinner: NgxSpinnerService,
    private mktService: MarketingService,
    private StorageService: LocalStorageService,
    private translocoService: TranslocoService,
    private router: Router,
    private routesPipe: RoutesPipe
  ) {
    this.service.currentUser.subscribe(
      (currentUserSubject) => (this.user = currentUserSubject)
    );
  }

 ngOnInit(): void {
  this.getCountries();
  // Autofill names from sign-up if available
  const signUpData = this.StorageService.getItem('sign-up-first-step');
  if (signUpData) {
    const parsed = JSON.parse(signUpData);
    if (parsed.FullNameEn) {
      this.form.controls['FullNameEn'].setValue(parsed.FullNameEn);
    }
    if (parsed.FullNameAr) {
      this.form.controls['FullNameAr'].setValue(parsed.FullNameAr);
    }
  }
  if (this.user.ProfileStatus != 0) {
    this.getPatient();
  }
}
  // first form
  getCountries() {
    this.spinner.show();
    return this.service
      .getCountries()
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.countries = res;
        this.spinner.hide();
        // remove disabled attr from saveChanges
        setTimeout(() => {
          this.saveChanges.nativeElement.removeAttribute('disabled');
        }, 200);
      });
  }
  getOccupations() {
    this.spinner.show();
    this.service
      .getOccupations()
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.occupations = res;
        this.spinner.hide();
      });
  }
  getPatient() {
    this.spinner.show();
    this.service
      .GetPatient()
      .pipe(map((res: any) => res['Data']))
      .subscribe((patient: any) => {
        this.patient = patient;
        this.service.currentUserValue.Name = patient.FullName;
        this.service.currentUserValue.NameAR = patient.FullNameAr;
        this.StorageService.setItem(
          'currentUser',
          JSON.stringify(this.service.currentUserValue)
        );

        this.service.currentUserSubject.next(this.service.currentUserValue);
        this.form.controls['FullNameEn'].setValue(patient.FullName);
        this.form.controls['FullNameAr'].setValue(patient.FullNameAr);
        this.form.controls['Occupation'].setValue(patient.OccupationId);

        //  this.translocoService.translate('form.input.gender.male ')

        var gender = patient.GenderId;
        this.setGenderValueToForm(gender);
        // birth date
        var date = new Date(patient.Birthdate);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        this.setDayValueToForm(day);
        this.setMonthValueToForm(month);
        this.setYearValueToForm(year);
        // Nationality
        // get nationality object from countries array
        setTimeout(() => {
          this.countries.find((country: any) => {
            if (country.Id == patient.NationalityId) {
              this.setNationalityToForm(country);
            }
          });
          // Occupation
          // get occupation object from occupations array
          // this.occupations.find((occupation:any) => {
          //   if(occupation.Id == patient.OccupationId){
          //     this.setOccupationToForm(occupation)
          //   }
          // })
        }, 500);

        this.spinner.hide();
      });
  }

  setGenderValueToForm(Gender: number) {
    if (Gender == 1) {
      this.form.controls['gender'].setValue(
        this.translocoService.translate('form.input.gender.male')
      );
    } else if (Gender == 2) {
      this.form.controls['gender'].setValue(
        this.translocoService.translate('form.input.gender.female')
      );
    }
  }
  setDayValueToForm(day: any) {
    this.form.controls['day'].setValue(day);
  }
  setMonthValueToForm(month: any) {
    this.form.controls['month'].setValue(month);
  }
  setYearValueToForm(year: any) {
    this.form.controls['year'].setValue(year);
  }
  getYears() {
    let years: any = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1900; i <= currentYear; i++) {
      years.push(i);
    }
    return years.reverse();
  }
  setNationalityToForm(Nationality: any) {
    this.form.controls['Nationality'].setValue(Nationality);
  }

  get ff() {
    return this.form.controls;
  }
  formSubmit() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }
    this.spinner.show();
    const image =
      this.form.value.image == ''
        ? ''
        : this.dataURLtoFile(this.form.value.image, 'profileImage.png');
    var form = {
      FullNameEn: this.form.value.FullNameEn,
      FullNameAr: this.form.value.FullNameAr,
      Birthdate: `${this.form.value.day}-${this.form.value.month}-${this.form.value.year}`,
      GenderId: +(this.form.value.gender ==
      this.translocoService.translate('form.input.gender.male')
        ? 1
        : 2),
      NationalityId: +this.form.value.Nationality.Id,
      OccupationId: this.form.value.Occupation,
      profileImage: image,
    };
    if (this.user.ProfileStatus == 0) {
      this.service.CreatePatientProfileFirstStep(form).subscribe((res: any) => {
        const eventData: any = this.mktService.setEventData(
          'Registration-First Step',
          `Signup First Step`,
          'New First Step'
        );
        this.mktService.onEventFacebook(eventData);
        this.router
          .navigate([], {
            queryParams: { redirect: null },
            queryParamsHandling: 'merge',
          })
          .then(() => {
          });
        this.spinner.hide();

        let currentUser = JSON.parse(
          this.StorageService.getItem(`${environment.localStorageUserKey}`)!
        );
        currentUser.ProfileStatus = res.Data.ProfileStatus;
        this.StorageService.setItem('currentUser', JSON.stringify(currentUser));

        this.router.navigate([
          this.routesPipe.transform('profile') +
            '/' +
            this.routesPipe.transform('location'),
        ]);

        // this.user.ProfileStatus = res.Data.ProfileStatus;
      });
    } else {
      this.service.UpdatePatientProfileFirstStep(form).subscribe((res: any) => {
        const eventData: any = this.mktService.setEventData(
          'Update Profile First Step',
          `Signup First Step`,
          'Update First Step'
        );

        this.mktService.onEventFacebook(eventData);
        this.getPatient();

        this.router.navigate([
          this.routesPipe.transform('profile') +
            '/' +
            this.routesPipe.transform('location'),
        ]);
        this.spinner.hide();
      });
    }
  }
  dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  nextStep() {
    this.formSubmit();
  }

  customValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value: string = control.value;

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
}
