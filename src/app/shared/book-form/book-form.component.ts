import { Component, Input } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { BookingSuccessfullyOfferComponent } from '../../components/booking-successfully-offer/booking-successfully-offer.component';
import { log } from 'console';

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
  appointmentTypes: any = [];
  times: any = [];
  public submitted = false;
  public form: FormGroup = this.formbuilder.group({
    clinic: ['', Validators.required],
    appointment: ['', Validators.required],
    appointmentDay: [
      `${new Date().toISOString().split('T')[0]}`,
      Validators.required,
    ],
    times: ['', Validators.required],
  });
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
        items: 8,
      },
      740: {
        items: 8,
      },
      940: {
        items: 9,
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
    private routesPipe: RoutesPipe
  ) {}

  ngOnInit(): void {
    this.dayes = this.enumerateDaysBetweenDates(
      new Date().setDate(new Date().getDate() - 1),
      new Date().setDate(new Date().getDate() + 15)
    );
    this.clinics = this.doctor['clinicDtos'];
    // find clinic by id
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
    } catch (error) {}

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
  }
  getAppointmentTypes() {
    console.log(this.doctor);
    return this.doctor['MedicalExamationTypes'];
  }
  enumerateDaysBetweenDates(startDate: any, endDate: any) {
    var dates: any = [];
    var currDate: any = moment(startDate).startOf('day');
    var lastDate: any = moment(endDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      var day: any = {
        // id: Number(currDate.clone().format('d')) + 1,
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

    // Reset all dependent selections when clinic changes
    this.resetAppointmentSelection();

    console.log('Selected clinic:', this.selectedClinic);
  }
}
  chooseAppointment(event: any, MedicalExaminationTypeId: any) {
  if (event.target.checked) {
    // Clear previous selection first
    this.selectedAppointment = null;
    this.times = [];
    this.fees = null;
    this.selectedDayId = null;
    this.BookedAppointments = [];

    // Reset form controls
    this.form.controls['times'].setValue('');

    // Set new selection
    this.selectedAppointment = this.appointmentTypes.find(
      (appointment: any) => appointment['Id'] == MedicalExaminationTypeId
    );

    console.log('Selected appointment:', this.selectedAppointment);

    // Only proceed if we have clinic and appointment selected
    if (this.selectedClinic && this.selectedAppointment) {
      // Get the currently selected day or default to today
      let selectedDay: any = this.dayes.find(
        (d: any) => d.date === this.form.value.appointmentDay
      );

      if (!selectedDay && this.dayes.length > 0) {
        // Find today's date or the first available day
        const today = new Date().toISOString().split('T')[0];
        selectedDay = this.dayes.find((d: any) => d.date === today) || this.dayes[0];
        this.form.controls['appointmentDay'].setValue(selectedDay.date);
      }

      if (selectedDay) {
        // Force refresh of schedule
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
  submit() {
  const EditAppointmentID = this.StorageService.getItem('EditAppointmentID');
  const isBooked = this.BookedAppointments.indexOf(this.form.value.times) > -1;

  if (isBooked) {
    Swal.fire({
      title: 'Already Booked',
      text: 'This time slot is already booked. Please select another time.',
      icon: 'warning',
      showConfirmButton: true,
    });
    return;
  }

  this.submitted = true;

  if (this.form.invalid) {
    // Scroll to first error
    const firstErrorElement = document.querySelector('.is-invalid') ||
                             document.querySelector('.red')?.parentElement;
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
    return;
  }

  // Validate that all required selections are made
  if (!this.selectedClinic || !this.selectedAppointment || !this.selectedDayId) {
    Swal.fire({
      title: 'Incomplete Selection',
      text: 'Please make sure you have selected a clinic, appointment type, day, and time.',
      icon: 'warning',
    });
    return;
  }

  const form = {
    DoctorId: this.doctor['Id'],
    DoctorWorkingDayTimeId: this.selectedDayId,
    AppointmentDate: `${this.form.value.appointmentDay}T${this.form.value.times}`,
    Fees: this.fees,
    Comment: '-',
    IsBook: true,
  };

  // Show confirmation dialog
  Swal.fire({
    title: this.translocoService.translate('swal.confirmBooking.title'),
    text: this.translocoService.translate('swal.confirmBooking.text'),
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: this.translocoService.translate('swal.confirmBooking.cancelButtonText'),
    confirmButtonText: this.translocoService.translate('swal.confirmBooking.confirmButtonText'),
  }).then((result) => {
    if (result.isConfirmed) {
      this.spinner.show();

      const bookingObservable = EditAppointmentID && EditAppointmentID !== ''
        ? this.service.editPatientappointment(
            EditAppointmentID,
            form.DoctorWorkingDayTimeId,
            form.AppointmentDate
          )
        : this.service.createPatientappointment(form);

      bookingObservable.subscribe({
        next: (res) => {
          this.spinner.hide();

          // Marketing event tracking
          const eventData = this.mktService.setEventData(
            'Patient Booking',
            'Appointment Booked',
            'Successful Booking'
          );
          this.mktService.onEventFacebook(eventData);

          const bookingData = {
            doctor: this.doctor,
            clinic: this.selectedClinic,
            appointment: this.selectedAppointment,
            day: this.form.value.appointmentDay,
            time: this.form.value.times,
          };

          this.StorageService.setItem('bookingData', JSON.stringify(bookingData));
          this.StorageService.setItem('EditAppointmentID', '');

          this.dialog.open(BookingSuccessfullyOfferComponent, {
            width: '600px',
            data: bookingData,
          });
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Booking error:', error);
          Swal.fire({
            title: 'Booking Failed',
            text: 'There was an error processing your booking. Please try again.',
            icon: 'error',
          });
        }
      });
    }
  });
}
  selectedDayId = null;
  setSelectedDayId(day: any) {

    this.selectedDayId = day.id;
  }resetAppointmentSelection() {
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
    // Show loading
    this.spinner.show();

    // Clear previous data
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

    // Fixed: Use correct method name and parameters
    this.service
      .getClinicSchedualByClinicDayId(
        ClinicId,
        DayId,
        MedicalExaminationTypeId,
        BookDate
      )
      .subscribe({
        next: (res: any) => {
          console.log('API Response:', res);

          if (res && res['Data'] && res['Data'].length > 0) {
            // Process booked appointments
            this.BookedAppointments = [];
            const BookedAppointments = res['Data'][0].BookedAppointments || [];

            BookedAppointments.forEach((a: any) => {
              const timeParts = a.split(' ');
              if (timeParts.length > 1) {
                const time = timeParts[1];
                this.BookedAppointments.push(time);
              }
            });

            // Process schedule data
            res['Data'].forEach((element: any) => {
              // Set fees
              this.fees = element.Fees;
              sessionStorage.setItem('Fees', element.Fees.toString());

              // Generate time slots
              if (element.MaxNoOfPatients == null) {
                element['times'] = this.timeInterval(
                  element.TimeFrom,
                  element.TimeTo,
                  element.TimeInterval || 30
                );
              } else {
                const minutesCount = this.getMinutesCount(
                  element.TimeFrom,
                  element.TimeTo
                );
                const interval = minutesCount / element.MaxNoOfPatients;
                element['times'] = this.timeInterval(
                  element.TimeFrom,
                  element.TimeTo,
                  interval
                );
                // Remove last slot if needed
                if (element['times'].length > 0) {
                  element['times'].pop();
                }
              }
            });

            this.times = res['Data'];

            // Set selectedDayId
            if (res['Data'].length > 0) {
              this.selectedDayId = res['Data'][0]['SchedualId'];
            }
          } else {
            // No data available
            this.times = [];
            this.selectedDayId = null;
            this.fees = null;
          }

          this.spinner.hide();
          console.log('Processed times:', this.times);
        },
        error: (error) => {
          console.error('Error fetching clinic schedule:', error);
          this.spinner.hide();
          this.times = [];
          this.selectedDayId = null;
          this.fees = null;

          // Show user-friendly error
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
    // get minutes count
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
  // time interval from two times in string return times array
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
