import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { AppService } from '../../services/app.service';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MarketingService } from '../../services/marketing.service';
import moment from 'moment';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { BookingSuccessfullyOfferComponent } from '../../components/booking-successfully-offer/booking-successfully-offer.component';
import { log } from 'console';
import { SignUpComponent } from '../../components/@authentication/sign-up/sign-up.component';
import { LoginComponent } from '../../components/@authentication/login/login.component';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CarouselModule,
    TranslocoModule,
    MatDialogModule,
    RouterModule,
    CommonModule,

    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0 }),
        animate(500, style({ height: '*' })),
      ]),
      transition(':leave', [animate(500, style({ height: 0 }))]),
    ]),
  ],
})
export class BookFormComponent {
  @Input() doctor: any = null;
  public clinics: any = [];
  fees: any;
  isChecked: boolean = false;

  appointmentTypes: any = [];
  times: any = [];
  selectedRelation: any = '';
  Realtions: any = [];
  public submitted = false;
  public form: FormGroup = this.formbuilder.group({
    clinic: ['', Validators.required],
    appointment: ['', Validators.required],
    appointmentDay: [
      `${new Date().toISOString().split('T')[0]}`,
      Validators.required,
    ],
    times: ['', Validators.required],
    relation: [''],
    fullName: [''],
  });
  isBrowser: boolean = false
  selectedClinic: any = null;
  selectedAppointment: any = null;
  public isBokking = false;
  public BookedAppointments: any = [];
  ClinicId = null;
  public isBooked = false;
  selectedClinicId: number | null = null;
  public dayes = [];
  daysOptions: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 4,
      },
      400: {
        items: 5,
      },
      740: {
        items: 5,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };
  constructor(
    private formbuilder: FormBuilder,
    private service: AppService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router,
    private mktService: MarketingService,
    private translocoService: TranslocoService,
    private StorageService: LocalStorageService,
    private routesPipe: RoutesPipe,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  getShortAddress(address: string): string {
    if (!address) return '';
    return address
      .split(/[\s\-\/]/)
      .slice(0, 2)
      .join(' ');
  }
  ngOnInit(): void {
    this.dayes = this.enumerateDaysBetweenDates(
      new Date().setDate(new Date().getDate() - 1),
      new Date().setDate(new Date().getDate() + 15)
    );
    this.clinics = this.doctor['clinicDtos'];
    this.selectedClinic = this.clinics.filter(
      (clinic: any) => clinic['active'] == true
    )[0];
    try {
      this.form.controls['clinic'].setValue(this.selectedClinic['ClinicId']);
      this.ClinicId = this.selectedClinic['ClinicId'];
      setTimeout(() => {
        document
          .getElementById('clinic-' + this.selectedClinic['ClinicId'])
          ?.click();
      }, 500);
    } catch (error) { }
    this.appointmentTypes = this.getAppointmentTypes();
    this.form.valueChanges.subscribe((value) => {
      if (value != undefined && value != null) {
        if (
          this.BookedAppointments != null &&
          value.times != null &&
          this.BookedAppointments.length > 0
        ) {
          this.isBooked = this.BookedAppointments.indexOf(value.times) > -1;
        }
      }
      if (this.isBooked) {
      } else {
        if (value.clinic && value.appointment && !value.appointmentDay) {
          setTimeout(() => {
            const date = this.dayes.find(
              (day: any) => day.date == new Date().toISOString().split('T')[0]
            );
            this.getClinicSchedualByClinicDayId(date);
          }, 100);
        }
      }
    });
    this.getBookingForAnotherPatient();
  }
  getAppointmentTypes() {
    return this.doctor['MedicalExamationTypes'];
  }
  getBookingForAnotherPatient() {
    this.service.getBookingForAnotherPatient().subscribe((res: any) => {
      this.Realtions = res['Data'];
    });
  }
  onCheck(event: any) {
    this.isChecked = event.target.checked;
    if (this.isChecked) {
      this.form.get('relation')?.setValidators(Validators.required);
      this.form.get('fullName')?.setValidators(Validators.required);
    } else {
      this.form.get('relation')?.clearValidators();
      this.form.get('fullName')?.clearValidators();
    }
    this.form.get('relation')?.updateValueAndValidity();
    this.form.get('fullName')?.updateValueAndValidity();
  }
  enumerateDaysBetweenDates(startDate: any, endDate: any) {
    var dates: any = [];
    var currDate: any = moment(startDate).startOf('day');
    var lastDate: any = moment(endDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      var day: any = {
        id: Number(currDate.clone().format('d')) + 1,
        name: currDate.clone().format('dddd'),
        date: currDate.clone().format('YYYY-MM-DD'),
        number: currDate.clone().format('DD'),
        month: currDate.clone().format('MM'),
        year: currDate.clone().format('YYYY'),
        name_ar:
          currDate.clone().format('dddd') == 'Saturday'
            ? 'السبت'
            : currDate.clone().format('dddd') == 'Sunday'
              ? 'الاحد'
              : currDate.clone().format('dddd') == 'Monday'
                ? 'الاثنين'
                : currDate.clone().format('dddd') == 'Tuesday'
                  ? 'الثلاثاء'
                  : currDate.clone().format('dddd') == 'Wednesday'
                    ? 'الاربعاء'
                    : currDate.clone().format('dddd') == 'Thursday'
                      ? 'الخميس'
                      : currDate.clone().format('dddd') == 'Friday'
                        ? 'الجمعة'
                        : '',
      };
      dates.push(day);
    }
    return dates;
  }
  chooseClinic(event: any, ClinicId: any) {
    if (event.target.checked) {
      this.selectedClinic = this.clinics.find(
        (clinic: any) => clinic['ClinicId'] == ClinicId
      );
      this.resetAppointmentSelection();
      console.log('Selected clinic:', this.selectedClinic);
    }
  }
  chooseAppointment(event: any, MedicalExaminationTypeId: any) {
    if (event.target.checked) {
      this.selectedAppointment = null;
      this.times = [];
      this.fees = null;
      this.selectedDayId = null;
      this.BookedAppointments = [];
      this.form.controls['times'].setValue('');
      this.selectedAppointment = this.appointmentTypes.find(
        (appointment: any) => appointment['Id'] == MedicalExaminationTypeId
      );
      console.log('Selected appointment:', this.selectedAppointment);
      if (this.selectedClinic && this.selectedAppointment) {
        let selectedDay: any = this.dayes.find(
          (d: any) => d.date === this.form.value.appointmentDay
        );
        if (!selectedDay && this.dayes.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          selectedDay =
            this.dayes.find((d: any) => d.date === today) || this.dayes[0];
          this.form.controls['appointmentDay'].setValue(selectedDay.date);
        }
        if (selectedDay) {
          setTimeout(() => {
            this.getClinicSchedualByClinicDayId(selectedDay);
          }, 100);
        }
      }
    }
  }
  get f() {
    return this.form.controls;
  }
  isLogged(): boolean {
    const token = this.StorageService.getItem('currentUser');
    return !!token;
  }
  submit() {
    if (!this.isLogged()) {
      this.dialog.open(SignUpComponent, {
        width: '430px',
        disableClose: false
      });
      return;
    }
    var EditAppointmentID = this.StorageService.getItem('EditAppointmentID');
    var isBooked = this.BookedAppointments.indexOf(this.form.value.times) > -1;
    if (isBooked) {
      Swal.fire({
        title: 'Already Booked',
        text: 'you can book again if you want',
        icon: 'info',
        showConfirmButton: false,
        timer: 2000,
      }).then((result) => { });
    } else {
      this.submitted = true;
      if (this.form.invalid) {
        // window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }
      const form = {
        DoctorId: this.doctor['Id'],
        DoctorWorkingDayTimeId: this.selectedDayId,
        AppointmentDate: `${this.form.value.appointmentDay}T${this.form.value.times}`,
        Fees: this.fees,
        Comment: '-',
        IsBook: true,
        ...(this.isChecked && {
          RelationId: this.form.value.relation,
          FullName: this.form.value.fullName,
        }),
      };

      Swal.fire({
        title: this.translocoService.translate('swal.confirmBooking.title'),
        text: this.translocoService.translate('swal.confirmBooking.text'),
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: this.translocoService.translate(
          'swal.confirmBooking.cancelButtonText'
        ),
        confirmButtonText: this.translocoService.translate(
          'swal.confirmBooking.confirmButtonText'
        ),
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          if (EditAppointmentID != null && EditAppointmentID != '') {
            this.service
              .editPatientappointment(
                EditAppointmentID,
                form.DoctorWorkingDayTimeId,
                form.AppointmentDate
              )
              .subscribe((res) => {
                this.spinner.hide();
                const eventData: any = this.mktService.setEventData(
                  'Patient Booking',
                  `Signup Third Step`,
                  'New Third Step'
                );
                this.mktService.onEventFacebook(eventData);
                const bookingData = {
                  doctor: this.doctor,
                  clinic: this.selectedClinic,
                  appointment: this.selectedAppointment,
                  day: this.form.value.appointmentDay,
                  time: this.form.value.times,
                  fees: this.fees,
                };
                this.StorageService.setItem(
                  'bookingData',
                  JSON.stringify(bookingData)
                );
                this.StorageService.setItem('EditAppointmentID', '');
                this.dialog.open(BookingSuccessfullyOfferComponent, {
                  width: '600px',
                  disableClose: false
                });
              });
          } else {
            this.service.createPatientappointment(form).subscribe((res) => {
              this.spinner.hide();
              const bookingData = {
                doctor: this.doctor,
                clinic: this.selectedClinic,
                appointment: this.selectedAppointment,
                day: this.form.value.appointmentDay,
                time: this.form.value.times,
              };
              this.StorageService.setItem(
                'bookingData',
                JSON.stringify(bookingData)
              );
              this.dialog.open(BookingSuccessfullyOfferComponent, {
                width: '600px',
                disableClose: false,
              });
            });
          }
        } else {
          Swal.fire({
            title: 'booking canceled',
            text: 'you can book again if you want',
            icon: 'info',
            showConfirmButton: false,
            timer: 2000,
          }).then((result) => {
          });
        }
      });
    }
  }

  // private handleBookingError(error: any) {
  //   this.spinner.hide();
  //   console.error('Booking error:', error);
  //   if (error?.status === 0) {
  //     Swal.fire({
  //       title:
  //         this.translocoService.translate?.('swal.errorBooking.title') ||
  //         'Authentication required',
  //       text:
  //         this.translocoService.translate?.('swal.errorBooking.text') ||
  //         'Please sign up or login before booking an appointment.',
  //       icon: 'info',
  //       showCancelButton: false,
  //       confirmButtonText:
  //         this.translocoService.translate?.('swal.errorBooking.confirm') || 'Sign Up',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.dialog.open(SignUpComponent, {
  //           width: '400px',
  //           height: 'auto',
  //         });
  //       }
  //     });
  //     return;
  //   }
  //   if (error?.status === 401) {
  //     Swal.fire({
  //       title: 'Session Expired',
  //       text: 'Your session has expired. Please log in again.',
  //       icon: 'warning',
  //       confirmButtonText: 'OK',
  //     }).then(() => {
  //       this.StorageService.removeItem('token');
  //       this.dialog.open(LoginComponent, { width: '400px', height: 'auto' });
  //     });
  //     return;
  //   }
  //   const serverMsg =
  //     (error?.error?.Message && String(error.error.Message)) ||
  //     (typeof error?.error === 'string' ? error.error : '') ||
  //     '';
  //   if (serverMsg) {
  //     Swal.fire({
  //       title: 'Booking Error',
  //       text: serverMsg,
  //       icon: 'error',
  //       confirmButtonText: 'OK',
  //     });
  //   } else {
  //     Swal.fire({
  //       title: 'Booking Error',
  //       text: 'An error occurred while booking. Please try again.',
  //       icon: 'error',
  //       confirmButtonText: 'OK',
  //     });
  //   }
  // }
  // private scrollToError() {
  //   const firstErrorElement =
  //     document.querySelector('.is-invalid') ||
  //     document.querySelector('.red')?.parentElement;
  //   if (firstErrorElement) {
  //     firstErrorElement.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'center',
  //     });
  //   } else {
  //     window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  //   }
  // }
  selectedDayId = null;
  setSelectedDayId(day: any) {
    this.selectedDayId = day.id;
  }
  resetAppointmentSelection() {
    this.selectedAppointment = null;
    this.times = [];
    this.fees = null;
    this.selectedDayId = null;
    this.BookedAppointments = [];
    this.form.controls['appointment'].setValue('');
    this.form.controls['times'].setValue('');
  }
  resetTimeSelection() {
    this.times = [];
    this.fees = null;
    this.selectedDayId = null;
    this.BookedAppointments = [];
    this.form.controls['times'].setValue('');
  }
  getClinicSchedualByClinicDayId(day: any) {

    if (this.isBrowser) {
      this.spinner.show();
    }

    this.times = [];
    this.fees = null;
    this.BookedAppointments = [];
    this.form.controls['times'].setValue('');
    const ClinicId = this.selectedClinic['ClinicId'];
    const DayId = day.id;
    const MedicalExaminationTypeId = this.selectedAppointment['Id'];
    const BookDate = day.date;
    console.log('Fetching schedule for:', {
      ClinicId,
      DoctorId: this.doctor['Id'],
      DayId,
      MedicalExaminationTypeId,
      BookDate,
    });
    this.service
      .getClinicSchedualByClinicDayId(
        ClinicId,
        DayId,
        MedicalExaminationTypeId,
        BookDate
      )
      .subscribe({
        next: (res: any) => {
          if (res && res['Data'] && res['Data'].length > 0) {
            const firstElement = res['Data'][0];
            this.BookedAppointments = [];
            const BookedAppointments = firstElement.BookedAppointments || [];
            BookedAppointments.forEach((a: any) => {
              const timeParts = a.split(' ');
              if (timeParts.length > 1) {
                const time = timeParts[1];
                this.BookedAppointments.push(time);
              }
            });
            this.fees = firstElement.Fees;
            if (this.isBrowser) {
              sessionStorage.setItem('Fees', firstElement.Fees.toString());
            }
            if (firstElement.MaxNoOfPatients == null) {
              firstElement['times'] = this.timeInterval(
                firstElement.TimeFrom,
                firstElement.TimeTo,
                firstElement.TimeInterval || 30
              );
            } else {
              const minutesCount = this.getMinutesCount(
                firstElement.TimeFrom,
                firstElement.TimeTo
              );
              const interval = minutesCount / firstElement.MaxNoOfPatients;
              firstElement['times'] = this.timeInterval(
                firstElement.TimeFrom,
                firstElement.TimeTo,
                interval
              );
              if (firstElement['times'].length > 0) {
                firstElement['times'].pop();
              }
            }
            this.times = [firstElement];
            this.selectedDayId = firstElement['SchedualId'];

          } else {
            this.times = [];
            this.selectedDayId = null;
            this.fees = null;
          }

          this.spinner.hide();
          console.log('Processed times:', this.times);
        }
        ,
        error: (error) => {
          console.error('Error fetching clinic schedule:', error);
          this.spinner.hide();
          this.times = [];
          this.selectedDayId = null;
          this.fees = null;
          Swal.fire({
            title: 'خطأ',
            text: 'حدث خطأ في تحميل المواعيد. برجاء المحاولة مرة أخرى.',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
          });
        },
      });
  }
  getMinutesCount(timeFrom: any, timeTo: any) {
    var timeFrom = timeFrom.split(':');
    var timeTo = timeTo.split(':');
    var hoursFrom = parseInt(timeFrom[0]);
    var hoursTo = parseInt(timeTo[0]);
    var minutesFrom = parseInt(timeFrom[1]);
    var minutesTo = parseInt(timeTo[1]);
    var hours = hoursTo - hoursFrom;
    var minutes = 0;
    if (hours > 0) {
      minutes = hours * 60 - minutesFrom + minutesTo;
    } else {
      minutes = minutesTo - minutesFrom;
    }
    return minutes;
  }
  private isTimeValid(selectedTime: string): boolean {
    const now = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const selectedDate = new Date(this.form.value.appointmentDay);
    selectedDate.setHours(hours, minutes, 0, 0);
    return selectedDate > now;
  }
  timeInterval(startTime: any, endTime: any, add: any = 30) {
    var times: any = [];
    var start: any = moment(startTime, 'HH:mm');
    var end = moment(endTime, 'HH:mm');
    while (start <= end) {
      var Booked = this.BookedAppointments.indexOf(start.format('HH:mm')) > -1;
      times.push({
        time24: start.format('HH:mm'),
        time12: start.format('hh:mm A'),
        IsBooked: Booked,
      });
      start.add(add, 'minutes');
    }
    return times;
  }
  getLanguage() {
    return this.translocoService.getActiveLang();
  }
}
