import {
  Component,
  ViewChild,
  ViewEncapsulation,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SearchFormService } from '../../services/search-form.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatSelectModule } from '@angular/material/select';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { CommonModule } from '@angular/common';
import { MetadataService } from '../../services/metadata.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { forkJoin, of, switchMap, tap } from 'rxjs';
import { AppService } from '../../services/app.service';
// import { MatSelectFilterModule } from '../../../assets/libs/mat-select-filter';
export enum TableEnum {
  SeniorityLevel = 1,
  Speciality = 2,
  MediacalType = 3,
  City = 4,
  Area = 5,
  SubSpeciality = 6,
}

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    TranslocoModule,
    MatSelectModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    CommonModule,
    // MatSelectFilterModule
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SearchFormComponent {
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'Id',
    textField: 'Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    searchPlaceholderText: 'Search',
    closeDropDownOnSelection: true,
  };

  subSpecialtyTitle: any;
  subSpecialtyUrlValue: any = this.service.replaceDashWithSpace(
    this.route.snapshot.paramMap.get('sub-specialty')
  );

  form: any = {
    loading: false,
    specialty: {
      list: [],
      urlValue: this.service.replaceDashWithSpace(
        this.route.snapshot.paramMap.get('specialty')
      ),
      selectedValue: [],
    },
    city: {
      list: [],
      urlValue: this.service.replaceDashWithSpace(
        this.route.snapshot.paramMap.get('city')
      ),
      selectedValue: [],
    },
    area: {
      list: [],
      urlValue: this.service.replaceDashWithSpace(
        this.route.snapshot.paramMap.get('area')
      ),
      selectedValue: [],
    },
    doctorName: null,
  };
  constructor(
    private service: SearchFormService,
    private router: Router,
    private route: ActivatedRoute,
    public translocoService: TranslocoService,
    private routesPipe: RoutesPipe,
    private metadataService: MetadataService,
    private storage: LocalStorageService,
    public language: TranslocoService,
    private appSer: AppService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.form.specialty.urlValue = this.service.replaceDashWithSpace(
        params.get('specialty')
      );
      this.form.city.urlValue = this.service.replaceDashWithSpace(
        params.get('city')
      );
      this.form.area.urlValue = this.service.replaceDashWithSpace(
        params.get('area')
      );
      this.loadFormData();
    });
    setInterval(() => {
      this.subSpecialtyTitle = JSON.parse(
        this.storage.getItem('filterTitle', 'session') || '{}'
      );
    }, 1000);
  }

  ngOnInit(): void {
    this.loadFormData();
    this.checkForDoctorName();
  }

  loadFormData() {
    // Set loading to true before starting requests
    this.form.loading = true;

    // Use forkJoin to load both specialists and cities in parallel
    forkJoin({
      specialists: this.service.getSpecialists(),
      cities: this.service.getCities(),
    })
      .pipe(
        switchMap((res: any) => {
          // console.clear();
          // console.log('Specialists response:', res.specialists);
          // console.log('Cities response:', res.cities);

          // Assign the results after loading completes
          this.form.specialty.list = res.specialists.Data || [];
          this.form.city.list = res.cities.Data || [];

          // Check if urlValue exists and set selectedValue for specialty
          const specialtyUrlValue = this.form.specialty.urlValue;
          const cityUrlValue = this.form.city.urlValue;
          //console.log(specialtyUrlValue)

          if (specialtyUrlValue) {
            if (
              specialtyUrlValue !== 'all specialities' &&
              specialtyUrlValue !== 'كل التخصصات'
            ) {
              const foundSpecialty = this.form.specialty.list.find(
                (specialty: any) => specialty.Name === specialtyUrlValue
              );
              this.form.specialty.selectedValue = [
                { Id: foundSpecialty.Id, Name: foundSpecialty.Name },
              ];
            }
          }

          // Find the city based on the URL value and get areas if city exists
          if (cityUrlValue) {
            const foundCity = this.form.city.list.find(
              (city: any) => city.Name === cityUrlValue
            );
            this.form.city.selectedValue = [
              { Id: foundCity.Id, Name: foundCity.Name },
            ];

            // Fetch areas based on the selected city
            return this.service.getAreas(foundCity.Id); // Get areas based on selected city Id
          }

          // If no city value, just return an empty observable
          return of({ Data: [] });
        })
      )
      .subscribe(
        (areasRes: any) => {
          // Handle areas response
          //console.log('Areas response:', areasRes);
          this.form.area.list = areasRes.Data || [];

          // Check if urlValue exists and set selectedValue for area
          const areaUrlValue = this.form.area.urlValue;
          if (areaUrlValue) {
            const foundArea = this.form.area.list.find(
              (area: any) => area.Name === areaUrlValue
            );
            this.form.area.selectedValue = [
              { Id: foundArea.Id, Name: foundArea.Name },
            ];
          }

          // Set loading to false after all data is loaded
          this.form.loading = false;
        },
        (error) => {
          console.error('Error loading form data:', error);
          // Set loading to false in case of an error
          this.form.loading = false;
        }
      );
  }
  checkForDoctorName() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.doctorName) {
        this.form.doctorName = params.doctorName;
      }
    });
  }

  getAreas(event: any) {
    const cityId = event.Id;
    this.form.loading = true;
    this.service.getAreas(cityId).subscribe((res: any) => {
      this.form.area.list = res.Data;
      this.form.loading = false;
    });
  }

 search() {
  const doctorName = this.form.doctorName?.trim();

  // Check if only doctor name is provided
  if (
    this.form.specialty.selectedValue.length === 0 &&
    this.form.city.selectedValue.length === 0 &&
    this.form.area.selectedValue.length === 0 &&
    doctorName
  ) {
    // Navigate with query param then force reload
    this.router.navigate([this.routesPipe.transform('find-a-doctor')], {
      queryParams: { doctorName }
    }).then(() => {
      window.location.reload(); // 👈 Force reload after navigation
    });
    return;
  }

  const lang = this.language.getActiveLang();
  let url = `${this.routesPipe.transform('find-a-doctor')}`;

  if (this.form.specialty.selectedValue.length > 0) {
    url += `/${this.service.replaceSpaceWithDash(this.form.specialty.selectedValue[0].Name)}`;
  } else {
    url += `/${lang === 'ar' ? 'كل-التخصصات' : 'all-specialities'}`;
  }

  if (this.form.city.selectedValue.length > 0) {
    url += `/${this.service.replaceSpaceWithDash(this.form.city.selectedValue[0].Name)}`;
  }

  if (this.form.area.selectedValue.length > 0) {
    url += `/${this.service.replaceSpaceWithDash(this.form.area.selectedValue[0].Name)}`;
  }

  this.router.navigate([url], {
    queryParams: {
      ...(doctorName && { doctorName })
    }
  }).then(() => {
    window.location.reload(); // 👈 Force reload after full URL update
  });
}

}
