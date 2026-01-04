import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MarketingService } from '../../../../services/marketing.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { RoutesPipe } from '../../../../pipes/routes.pipe';
import { log } from 'node:console';

@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    MatMenuModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss',
})
export class SecondStepComponent {
  @ViewChild('saveChanges') saveChanges: any;

  public patient: any;
  public countries: any;
  public cities: any;
  areas: any;
  public formSubmitted = false;
  public form: any = this.formbuilder.group({
    // CountryId : ['',Validators.required],
    CityId: ['', Validators.required],
    AreaId: ['', Validators.required],
    Address: [
      '',
      [
        Validators.pattern(
          /^(?=.*[\u0600-\u06FF])([0-9]*[\u0600-\u06FF]+[\u0600-\u06FF0-9\s]*)$/
        ),
      ],
    ],
    BlockNo: ['', Validators.nullValidator],
    FloorNo: ['', Validators.nullValidator],
    ApartmentNo: ['', Validators.nullValidator],

    // image:['',Validators.nullValidator],
    // // Address : ['',[Validators.required,Validators.pattern(/^[a-zA-Z ]*$/)]],
    // // FullNameAr : ['',[Validators.nullValidator,Validators.pattern(/[\u0600-\u06FF]/)]],

    // gender : ['',Validators.required],
    // day:['',Validators.required],
    // month:['',Validators.required],
    // year:['',Validators.required],
    // Occupation : ['',Validators.required],
  });
  public user: any;
  lang = this.translocoService.getActiveLang();
  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: AuthenticationService,
    private spinner: NgxSpinnerService,
    private mktService: MarketingService,
    private StorageService: LocalStorageService,
    private translocoService: TranslocoService,
    private router: Router,
    private routesPipe: RoutesPipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.service.currentUser.subscribe(
      (currentUserSubject) => (this.user = currentUserSubject)
    );
  }

  ngOnInit(): void {
    // get prams from url

    this.route.queryParams.subscribe((params: any) => {
      if (params.redirect) {
        this.getCities();
      } else {
        this.getPatient();
      }
    });
  }

  getPatient() {
    this.spinner.show();
    const sanitize = (v: any) => {
      if (v === null || v === undefined) return '';
      if (typeof v === 'string' && (v.trim().toLowerCase() === 'null' || v.trim().toLowerCase() === 'undefined')) return '';
      return v;
    };

    this.service
      .GetPatient()
      .pipe(map((res: any) => res['Data']))
      .subscribe({
        next: (patient: any) => {
          this.patient = patient ?? {}
          const blockNo = sanitize(patient?.BlockNo);
          const floorNo = sanitize(patient?.FloorNo);
          const apartmentNo = sanitize(patient?.ApartmentNo);
          const address = sanitize(patient?.Address);

          let cityObj: any = '';
          if (patient?.CityId) {

            if (typeof patient.CityId === 'object' && patient.CityId !== null) {
              cityObj = patient.CityId;
            } else if (!isNaN(+patient.CityId)) {

              cityObj = +patient.CityId;
            } else {
              cityObj = '';
            }
          }

          let areaObj: string | number | object = '';
          if (patient?.AreaId) {
            if (typeof patient.AreaId === 'object' && patient.AreaId !== null) {
              areaObj = patient.AreaId;
            } else if (!isNaN(+patient.AreaId)) {
              areaObj = +patient.AreaId;
            } else {
              areaObj = '';
            }
          }
          this.form.patchValue({
            Address: address,
            CityId: cityObj,
            AreaId: areaObj,
            BlockNo: blockNo,
            FloorNo: floorNo,
            ApartmentNo: apartmentNo,
          });
          console.log('Patched form values:', this.form.value);
          this.getCities();
          this.spinner.hide();
        },
        error: (err) => {
          console.error('GetPatient error', err);
          this.spinner.hide();
        }
      });
  }

  getCities(CountryId: any = 1) {

    this.spinner.show();
    this.service
      .getCities(CountryId)
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.cities = res;
        this.spinner.hide();
        try {
          this.cities.forEach((city: any) => {
            if (city.Id == this.patient.CityId) {
              this.form.controls['CityId'].setValue(city);
              this.setCityIdToForm(city);
            }
          });
        } catch (error) { }

        if (this.patient) {
          this.getAreas(this.patient.CityId);
        } else {
          if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
              this.saveChanges.nativeElement.removeAttribute('disabled');
            }, 1000);
          }
        }
      });
  }
  getAreas(CityId: any) {
    this.spinner.show();
    this.areas = [];
    this.setAreaIdToForm(null);

    this.service
      .getAreas(CityId)
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.areas = res;
        this.spinner.hide();
        if (this.patient) {
          this.areas.forEach((area: any) => {
            if (area.Id == this.patient.AreaId) {
              this.form.controls['AreaId'].setValue(area);
            }
          });
        }
       if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
              this.saveChanges.nativeElement.removeAttribute('disabled');
            }, 1000);
          }
      });
  }
  setCityIdToForm(CityId: any) {
    this.form.controls['CityId'].setValue(CityId);
    this.getAreas(CityId.Id);
  }
  setAreaIdToForm(AreaId: any) {
    this.form.controls['AreaId'].setValue(AreaId);
  }

  get ff() {
    return this.form.controls;
  }
  formSubmit() {
    this.formSubmitted = true;

    if (this.form.invalid) {
      // window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    this.spinner.show();
    this.service
      .UpdatePatientProfileSecondStep(this.form.value)
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.spinner.hide();
        const eventData: any = this.mktService.setEventData(
          'Update Profile - Second Step',
          `Signup Second Step`,
          'Second Step'
        );

        this.mktService.onEventFacebook(eventData);

        let currentUser = JSON.parse(
          this.StorageService.getItem(`${environment.localStorageUserKey}`)!
        );
        currentUser.ProfileStatus = res.ProfileStatus;
        this.StorageService.setItem('currentUser', JSON.stringify(currentUser));
        this.router.navigate([
          this.routesPipe.transform('profile') +
          '/' +
          this.routesPipe.transform('medical-state'),
        ]);
      });
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
  previousStep() {
    this.router.navigate([
      this.routesPipe.transform('profile') +
      '/' +
      this.routesPipe.transform('personal-info'),
    ]);
  }
}
