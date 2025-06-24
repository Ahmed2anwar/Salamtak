import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { languages } from '../../languages';
import { AuthenticationService } from '../../services/authentication.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-booking-successfully-offer',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    RoutesPipe,
  ],
  templateUrl: './booking-successfully-offer.component.html',
  styleUrl: './booking-successfully-offer.component.scss',
})
export class BookingSuccessfullyOfferComponent {
  booking: any;
  public user: any;
  public IsArabic: any;
  public IsEnglish: any;
  public patient: any;
  address: any;
  area: any;
  dialogRef = inject(MatDialogRef);
  floor: any;
  appartment: any;
  languages = languages;
  username: any;
  fees: any;
  selectedLanguage = this.languages[0];
  lang: any = this.translocoService.getActiveLang();
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private authentication: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private StorageService: LocalStorageService,
    private metadataService: MetadataService
  ) {
    this.authentication.currentUser.subscribe(
      (currentUserSubject) => (this.user = currentUserSubject)
    );
    this.booking = JSON.parse(
      this.StorageService.getItem('bookingData') || '{}'
    );
  }
  ngOnInit(): void {
    this.metadataService.updateMetadata('booking-successfully-offer');
    this.getPatient();
    // sessionStorage.setItem('Fees', '150');
    this.fees = sessionStorage.getItem('Fees');
    console.log('Fees from sessionStorage:', this.fees);
    this.cdr.detectChanges();
    const lang = this.translocoService.getActiveLang();
    if (lang) {
      if (lang === 'ar') {
        this.IsEnglish = false;
        this.IsArabic = true;
        this.floor = 'رقم الدور';
        this.appartment = 'رقم الشقة';
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
      this.booking['doctor']['HealthEntityDTO']['CityName'] +
      ' ' +
      this.booking['doctor']['HealthEntityDTO']['AreaName'];
    this.address = this.booking['doctor']['HealthEntityDTO']['Address'];
    if (
      this.booking['doctor']['HealthEntityDTO']['FloorNo'] != null &&
      this.booking['doctor']['HealthEntityDTO']['FloorNo'] != '0'
    ) {
      this.address =
        this.address +
        ' ' +
        this.floor +
        ' ' +
        this.booking['doctor']['HealthEntityDTO']['FloorNo'];
    }
    if (
      this.booking['doctor']['HealthEntityDTO']['ApartmentNo'] != null &&
      this.booking['doctor']['HealthEntityDTO']['ApartmentNo'] != '0'
    ) {
      this.address =
        this.address +
        ' ' +
        this.appartment +
        ' ' +
        this.booking['doctor']['HealthEntityDTO']['ApartmentNo'];
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
  goToMySchedule(): void {
    const lang = this.translocoService.getActiveLang() || 'en';
    if (lang === 'ar') {
      this.router.navigate([`/ar/جدولي`]);
      this.dialogRef?.close();
    } else {
      this.router.navigate([`/en/my-schedule`]);
      this.dialogRef?.close();
    }
  }
  age: number = 0;

  onAgeInput(event: any): void {
    const value = +event.target.value;
    if (value < 0) {
      this.age = 0;
    } else {
      this.age = value;
    }
  }
}
