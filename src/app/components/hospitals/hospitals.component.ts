import { Component } from '@angular/core';
import { map } from 'rxjs';
import { AppService } from '../../services/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { SearchFormService } from '../../services/search-form.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule } from '@angular/forms';
import { MetadataService } from '../../services/metadata.service';
import { LoginComponent } from '../@authentication/login/login.component';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitals',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    SearchFormComponent,
    AccordionModule,
    FormsModule,
  ],
  templateUrl: './hospitals.component.html',
  styleUrl: './hospitals.component.scss',
})
export class HospitalsComponent {
  data: any = {
    Items: [],
  };
  suppressContent = false;
  cities: any = [];
  CityId: any = null;
  areas: any = [];
  areaId: any = null;
  loading = false;
  storageUrl = environment.storageUrl;
  public doctorViewerOptions: any = {
    navbar: false,
    toolbar: false,
    title: false,
    movable: false,
  };
  private HealthEntityPagedList = 2;
  public filterObject: any;

  constructor(
    private service: AppService,
    private spinner: NgxSpinnerService,
    private servicee: SearchFormService,
    private translocoService: TranslocoService,
    private metadataService: MetadataService,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.metadataService.updateMetadata('hospitals');

    this.getHealthEntityPagedList();
    this.getCities();
  }
  getHealthEntityPagedList(
    MaxResultCount = 10,
    SkipCount = 0,
    filters = false
  ) {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.suppressContent = true;

      this.loading = false;
      this.spinner.hide?.();

      // 🔔 Alert to tell the user to sign up first
      Swal.fire({
        icon: 'info',
        title:
          this.translocoService.getActiveLang() === 'ar' ? 'تنبيه' : 'Notice',
        text:
          this.translocoService.getActiveLang() === 'ar'
            ? 'يرجى تسجيل الدخول أولاً للوصول إلى هذه الصفحة.'
            : 'Please log in first to access this page.',
        confirmButtonText:
          this.translocoService.getActiveLang() === 'ar'
            ? 'تسجيل الدخول'
            : 'Login',
        confirmButtonColor: '#222161',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        this.suppressContent = true;
        if (result.isConfirmed) {
          // 🔹 Open your login dialog here
          this.dialog.open(LoginComponent, {
            width: '400px',
            disableClose: true,
          });
        }
      });

      return;
    }

    this.loading = true;
    const filter = {
      MaxResultCount,
      SkipCount,
      ...(this.CityId && { CityId: +this.CityId }),
      ...(this.areaId && { AreaId: +this.areaId }),
    };

    this.filterObject = filter;
    this.spinner.show();

    this.service
      .getHealthEntityPagedList(this.HealthEntityPagedList, filter)
      .pipe(map((res) => res['Data']))
      .subscribe({
        next: (res) => {
          this.data.TotalCount = res?.TotalCount ?? 0;
          this.data.Items = filters
            ? res?.Items || []
            : [...(this.data.Items || []), ...(res?.Items || [])];

          setTimeout(() => (this.loading = false), 1000);
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.loading = false;
          this.spinner.hide();
        },
      });
  }

  handleImageError(text = '', e: any) {
    return (e.target.src = `https://ui-avatars.com/api/?name=${text}&background=222161&color=fff`);
  }
  getCities() {
    this.service.getCitiesBycountryId(1).subscribe((res: any) => {
      this.cities = res.Data;
    });
  }
  getAreasByCityId(cityId: any) {
    this.service.getAreas(cityId).subscribe((res: any) => {
      this.areas = res.Data;
    });
  }
  convertToArabicNumber(input: any) {
    const lang = this.translocoService.getActiveLang();
    const arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    if (lang === 'ar') {
      return input.replace(/\d/g, (match: any) => arabicNumbers[match]);
    } else {
      return input;
    }
  }
  converter(inp: any) {
    const arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return inp.replace(/\d/g, (match: any) => arabicNumbers[match]);
  }
  copyToClipboard(phoneNumber: string): void {
    navigator.clipboard
      .writeText(phoneNumber)
      .then(() => {
        alert('Phone number copied!');
      })
      .catch((err) => {
        console.error('Failed to copy!', err);
      });
  }
}
