import { Component, inject } from '@angular/core';
import { languages } from '../../languages';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AddNoteForDoctorComponent } from '../@popups/add-note-for-doctor/add-note-for-doctor.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-booking-successfully',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
  ],
  templateUrl: './booking-successfully.component.html',
  styleUrl: './booking-successfully.component.scss',
})
export class BookingSuccessfullyComponent {
  booking;
  public user: any;
  public IsArabic: any;
  public IsEnglish: any;
  public patient: any;
  address: any;
  area: any;
  floor: any;
  appartment: any;
  languages = languages;
  username: any;
  fees: any;
  selectedLanguage = this.languages[0];
  lang: any = this.translocoService.getActiveLang();

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<BookingSuccessfullyComponent>,
    private routes:ActivatedRoute,
    private router: Router,

    private translocoService: TranslocoService,
    private authentication: AuthenticationService,
    private StorageService: LocalStorageService,
    private metadataService: MetadataService,
    private route: RoutesPipe
  ) {
    this.authentication.currentUser.subscribe(
      (currentUserSubject) => (this.user = currentUserSubject)
    );
    // this.addNote();

    this.booking = JSON.parse(
      this.StorageService.getItem('bookingData') || '{}'
    );
  }

  ngOnInit(): void {
    this.metadataService.updateMetadata('booking-successfully');

    this.getPatient();
    this.fees = this.StorageService.getItem('Fees');

    const lang = this.translocoService.getActiveLang();
    if (lang) {
      if (lang === 'ar') {
        this.IsEnglish = false;
        this.IsArabic = true;
        this.floor = 'رقم الدور';
        this.appartment = 'رقم الشقة';
        // window.open('/termsAr')
      } else {
        this.IsEnglish = true;
        this.IsArabic = false;
        this.floor = 'رقم الدور';
        this.appartment = 'رقم الشقة ';
      }
    }

    this.booking = JSON.parse(
      this.StorageService.getItem('bookingData') || '{}'
    );

    this.area =
      this.booking['clinic']['CityName'] +
      ' ' +
      this.booking['clinic']['AreaName'];
    this.address = this.booking['clinic']['Address'];
    if (
      this.booking['clinic']['FloorNo'] != null &&
      this.booking['clinic']['FloorNo'] != '0'
    ) {
      this.address =
        this.address +
        ' ' +
        this.floor +
        ' ' +
        this.booking['clinic']['FloorNo'];
    }

    if (
      this.booking['clinic']['ApartmentNo'] != null &&
      this.booking['clinic']['ApartmentNo'] != '0'
    ) {
      this.address =
        this.address +
        ' ' +
        this.appartment +
        ' ' +
        this.booking['clinic']['ApartmentNo'];
    }
  }

  addNote(): void {
    const dialogRef = this.dialog.open(AddNoteForDoctorComponent, {
      data: {},
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  goToDoctor(doctor: any) {
    this.router
      .navigate(
        [this.route.transform('doctor-profile'), doctor.Id, doctor.DoctorName],
        {
          queryParams: {
            DoctorId: doctor.Id,
            AvalibleDate: new Date().toISOString().split('T')[0],
          },
        }
      )
      .then((res: any) => {
        this.StorageService.setItem('doctor', JSON.stringify(doctor));
      });
  }

  returnWeekDay(item: any) {
    var dt = item.substring(0, 10);
    var tm = item.substring(11);
    var h = tm.split(':')[0];
    var minu = tm.split(':')[1];
    var y = dt.split('-')[0];
    var m = parseInt(dt.split('-')[1]) - 1;
    var d = dt.split('-')[2];
    const lang = this.translocoService.getActiveLang();
    this.convertTime24to12(tm);
    const date = new Date(y, m, d);

    const options: any = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    if (lang === 'ar') {
      return new Intl.DateTimeFormat('ar-EG', options).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  }

  convertTime24to12(time24h: any) {
    let [hours, minutes] = time24h.split(':');
    let time12h = new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
    const lang = this.translocoService.getActiveLang();
    if (lang === 'ar') {
      return time12h.toLocaleTimeString('ar-EG', {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      });
    } else {
      return time12h.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      });
    }
  }

  getPatient() {
    this.authentication.GetPatient().subscribe((patient: any) => {
      this.patient = patient;
      const lang = this.translocoService.getActiveLang();

      if (lang) {
        if (lang === 'ar') {
          this.IsEnglish = false;
          this.IsArabic = true;
          this.username = this.patient.Data.FullNameAr;

          // window.open('/termsAr')
        } else {
          this.IsEnglish = true;
          this.IsArabic = false;
          this.username = this.patient.Data.FullName;
        }
        let Selected_lang = this.languages.find((t: any) => t.code === lang);

        this.selectedLanguage = Selected_lang;
        this.translocoService.setActiveLang(Selected_lang.code);
        this.translocoService.setActiveLang(Selected_lang.code);
        this.StorageService.setItem('lang', Selected_lang.code);
        document
          .getElementsByTagName('html')[0]
          .setAttribute('dir', Selected_lang.direction);
      }
    });
  }
   goToMySchedule(bookingId: number): void {
    const lang = this.routes.snapshot.paramMap.get('lang') || 'en';
    if (!bookingId) return;
    this.router.navigate(['/', lang, 'my-schedule'], {
      queryParams: { id: bookingId },
    });
    this.dialogRef.close()
  }
}
