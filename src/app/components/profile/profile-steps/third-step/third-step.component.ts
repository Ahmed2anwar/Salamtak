import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';
import { AppService } from '../../../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MarketingService } from '../../../../services/marketing.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { RoutesPipe } from '../../../../pipes/routes.pipe';

@Component({
  selector: 'app-third-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    MatMenuModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    RoutesPipe,
  ],
  templateUrl: './third-step.component.html',
  styleUrl: './third-step.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ThirdStepComponent {
  public patient: any;
  // public countries
  // public cities
  bloodTypes: any;
  MedicineAllergy: any = [];
  FoodAllergy: any = [];
  public user: any;
  lang = this.translocoService.getActiveLang();
  // areas
  public formSubmitted = false;
  public form: any = this.formbuilder.group({
    Height: [''],
    Weight: [''],
    Pressure: [''],
    SugarLevel: [''],
    BloodTypeId: [''],

    OtherAllergies: ['', Validators.nullValidator],
    MedicalAllergies: ['', Validators.nullValidator],
    FoodAllergies: ['', Validators.nullValidator],
    Prescriptions: ['', Validators.nullValidator],
    CurrentMedication: ['', Validators.nullValidator],
    PastMedication: ['', Validators.nullValidator],
    Injuries: ['', Validators.nullValidator],
    ChronicDiseases: ['', Validators.nullValidator],
    Surgeries: ['', Validators.nullValidator],
  });
  selectedMedicineAllergy: any;
  selectedFoodAllergy: any;
  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: AuthenticationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private authState: AuthenticationService,
    private mktService: MarketingService,
    private StorageService: LocalStorageService,
    private patientService: AppService,
    private translocoService: TranslocoService,
    private routesPipe: RoutesPipe
  ) {
    this.service.currentUser.subscribe(
      (currentUserSubject) => (this.user = currentUserSubject)
    );
  }

  ngOnInit(): void {
    this.getBloodTypes();
    // get prams from url
    this.route.queryParams.subscribe((params: any) => {
      if (params.redirect) {
      } else {
        // this.getCountries()
        // this.getCities();
        // this.getOccupations();
      }
    });
  }
  getFoodAllergy() {
    this.spinner.show();
    this.patientService
      .getFoodAllergy()
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.FoodAllergy = res;
        var arr: any = [];
        this.patient.PatientFoodAllergiesDto.forEach(
          (patientFoodAllergy: any) => {
            arr.push(patientFoodAllergy);
          }
        );
        this.form.controls['FoodAllergies'].setValue(arr);

        // this.form.controls['FoodAllergies'].setValue(res);
        this.spinner.hide();
      });
  }
  getMedicineAllergy() {
    this.spinner.show();
    this.patientService
      .getMedicineAllergy()
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.MedicineAllergy = res;
        var arr: any = [];
        this.patient.PatientMedicineAllergiesDto.forEach(
          (patientMedicineAllergy: any) => {
            arr.push(patientMedicineAllergy);
          }
        );
        this.form.controls['MedicalAllergies'].setValue(arr);
        this.spinner.hide();
      });
  }
  getPatient() {
    this.spinner.show();
    this.service
      .GetPatientMedicalInfo()
      .pipe(map((res: any) => res['Data']))
      .subscribe((patient: any) => {
        this.patient = patient;
        try {
          this.form.controls['Height'].setValue(patient.Height);
          this.form.controls['Weight'].setValue(patient.Weight);
          this.form.controls['Pressure'].setValue(patient.Pressure);
          this.form.controls['SugarLevel'].setValue(patient.SugarLevel);
          this.form.controls['OtherAllergies'].setValue(patient.OtherAllergies);
          this.form.controls['MedicalAllergies'].setValue(
            patient.MedicalAllergies
          );
          this.form.controls['FoodAllergies'].setValue(patient.FoodAllergies);
          this.form.controls['Prescriptions'].setValue(patient.Prescriptions);
          this.form.controls['CurrentMedication'].setValue(
            patient.CurrentMedication
          );
          this.form.controls['PastMedication'].setValue(patient.PastMedication);
          this.form.controls['Injuries'].setValue(patient.Iinjuries);
          this.form.controls['ChronicDiseases'].setValue(
            patient.ChronicDiseases
          );
          this.form.controls['Surgeries'].setValue(patient.Surgeries);
          this.form.controls['BloodTypeId'].setValue(patient.BloodTypeId);

          this.getMedicineAllergy();
          this.getFoodAllergy();
        } catch (error) {}

        this.spinner.hide();
      });
  }
  getBloodTypes() {
    this.spinner.show();
    this.service
      .getBloodTypes()
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.bloodTypes = res;

        this.spinner.hide();
        this.getPatient();
      });
  }
  // setGenderValueToForm(Gender:String){
  //   this.form.controls['gender'].setValue(Gender);
  // }

  setBloodTypeIdToForm(BloodTypeId: any) {
    this.form.controls['BloodTypeId'].setValue(BloodTypeId);
  }

  setAreaIdToForm(AreaId: any) {
    this.form.controls['AreaId'].setValue(AreaId);
  }
  // setOccupationToForm(Occupation:any){
  //   this.form.controls['Occupation'].setValue(Occupation);
  // }
  get ff() {
    return this.form.controls;
  }
  formSubmit() {
    this.formSubmitted = true;

    if (this.form.invalid) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    const form = {
      Id: this.patient.Id,
      Height: +this.form.value.Height,
      Weight: +this.form.value.Weight,
      Pressure: this.form.value.Pressure,
      SugarLevel: this.form.value.SugarLevel,
      BloodTypeId: this.form.value.BloodTypeId,
      OtherAllergies: this.form.value.OtherAllergies,
      Prescriptions: this.form.value.Prescriptions,
      CurrentMedication: this.form.value.CurrentMedication,
      PastMedication: this.form.value.PastMedication,
      ChronicDiseases: this.form.value.ChronicDiseases,
      Iinjuries: this.form.value.Injuries,
      Surgeries: this.form.value.Surgeries,
      PatientMedicineAllergiesDto: this.form.value.MedicalAllergies,
      PatientFoodAllergiesDto: this.form.value.FoodAllergies,
    };

    const formcreate = { ...form }; // same structure for create

    this.spinner.show();

    if (this.StorageService.getItem('new-user') === 'true') {
      this.service
        .CreatePatientProfileThirdStep(formcreate)
        .pipe(map((res: any) => res['Data']))
        .subscribe({
          next: (res: any) => {
            const eventData = this.mktService.setEventData(
              'Registration Third Step',
              'Signup Third Step',
              'New Third Step'
            );

            this.mktService.onEventFacebook(eventData);
            this.spinner.hide();
            this.StorageService.removeItem('new-user');
          },
          error: () => this.spinner.hide(),
        });
    } else {
      this.service
        .UpdatePatientProfileThirdStep(form)
        .pipe(map((res: any) => res['Data']))
        .subscribe({
          next: (res: any) => {
            const eventData = this.mktService.setEventData(
              'Update Profile Third Step',
              'Signup Third Step',
              'Update Third Step'
            );

            this.mktService.onEventFacebook(eventData);
              this.authState.setLoggedIn(true); // notify header

            const lang = this.translocoService.getActiveLang();
            if (lang == 'ar') {
              this.router.navigate(['/ar/الرئيسية']);
              this.spinner.hide();
            } else {
              this.router.navigate(['/en/home']);
              this.spinner.hide();
            }
          },
          error: () => this.spinner.hide(),
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
    // this.service.setStep(2);

    // this.router.navigate([`/${this.lang}/home`])
    this.router.navigate([this.routesPipe.transform('home')]);
    // this.router.navigate([`/${this.lang}/profile/succ`])
    this.router.navigate([this.routesPipe.transform('succ')]);
  }
  previousStep() {
    this.router.navigate([this.routesPipe.transform('location')]);
  }
}
