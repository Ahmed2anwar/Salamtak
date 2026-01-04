import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { SearchFormService } from '../../services/search-form.service';
import { MarketingService } from '../../services/marketing.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

// NEW imports
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginComponent } from '../@authentication/login/login.component';
import { log } from 'node:console';

@Component({
  selector: 'app-poly-clinic-doctors',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    RoutesPipe,
  ],
  templateUrl: './poly-clinic-doctors.component.html',
  styleUrl: './poly-clinic-doctors.component.scss',
})
export class PolyClinicDoctorsComponent {
  ClinicId: any;
  ClinicName: string | null = null;
  storageUrl = environment.storageUrl;
  public doctors: any = [];
  loading = false;
  lang: any;
fees:any
  public doctorViewerOptions: any = {
    navbar: false,
    toolbar: false,
    title: false,
    movable: false,
  };


  // New flag used in your snippet
  suppressContent = false;

  constructor(
    private StorageService: LocalStorageService,
    private service: AppService,
    private form: SearchFormService,
    private route: ActivatedRoute,
    private mktService: MarketingService,
    private translocoService: TranslocoService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private metadataService: MetadataService,
    private routesPipe: RoutesPipe,
    // NEW injections
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {
    this.lang = this.translocoService.getActiveLang();

    this.route.queryParams.subscribe((params) => {
      this.ClinicId = params['ClinicId'];
    });
    this.route.queryParams.subscribe((params) => {
      this.ClinicName = params['ClinicName'];
    });
  }

  bookFor(event: Event, doctor: any) {
  event?.preventDefault();
  const eventData: any = this.mktService.setEventData(
    'Patient Booked Doctor Appointment',
    `View Doctor Profile`,
    ' '
  );
  try {
    if (doctor) {
      this.StorageService.setItem('doctor', JSON.stringify(doctor));
      const feesStr = (doctor.Fees ?? 0).toString();
      this.StorageService.setItem('DoctorFees', feesStr);
      this.fees = doctor.Fees ?? 0;
    }
  } catch (err) {
    console.error('Storage error', err);
  }
  const route = this.routesPipe.transform('doctor-profile', doctor?.Id, doctor?.DoctorName);
  this.router
    .navigate([route], {
      queryParams: {
        DoctorId: doctor?.Id,
        ClinicId: doctor?.ClinicID,
        DoctorFees: doctor?.Fees,
      }
    })
    .then((res: boolean) => {
    })
    .catch((err: any) => {
      console.error('Navigation error', err);
    });
}

  async ngOnInit(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.suppressContent = true;
      this.loading = false;
      try {
        this.spinner.hide();
      } catch (e) {}
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
          this.dialog.open(LoginComponent, {
            width: '400px',
            disableClose: true,
          });
        }
      });

      return;
    }
    this.metadataService.updateMetadata('poly-clinic-doctors');
    await this.getDoctors();
     console.log('doctor fees:',this.fees);
  }
  async getDoctors(value: any = null) {
    this.loading = true;
    this.spinner.show();
    this.service.GetDoctorPolyClinic(this.ClinicId).subscribe((res: any) => {
      this.doctors = res['Data'];
      console.log('doctor:', this.doctors);
      this.spinner.hide();
    });
    this.loading = false;
  }

  goToDocProfile(doctor: any) {
    this.router.navigate(
      [this.routesPipe.transform('doctor'), doctor.DoctorId, doctor.DoctorName],
      {
        queryParams: {
          DoctorId: doctor.DoctorId,
          ClinicId: doctor.clinicDto.ClinicId,
        },
      }
    );
  }

  replaceSpaceWithDash(name: any) {
    return name?.replace(/ /g, '-');
  }
}
