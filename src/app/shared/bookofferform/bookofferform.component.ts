import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import moment from 'moment';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { AppService } from '../../services/app.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-bookofferform',
  standalone: true,
  imports: [
    CarouselModule,
    TranslocoModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './bookofferform.component.html',
  styleUrl: './bookofferform.component.scss',
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
export class BookofferformComponent {
  @Input() doctor: any = null;
  public clinics: any = [];
  fees: any;
  appointmentTypes = [];
  times :any = [];
  public submitted = false;
  selAppoint=1;
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
  ClinicId :any;
  public isBooked = false;
  public dayes = [];
  storageUrl = environment.storageUrl;


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
    private spinner: NgxSpinnerService,
    private router: Router,
    private translocoService: TranslocoService,
    private routesPipe: RoutesPipe,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    
    const modifiedEndDate = moment(this.doctor.EndDate).add(1, 'day').toISOString();
    this.dayes = this.enumerateDaysBetweenDates(
      new Date().setDate(new Date().getDate() - 1),
      modifiedEndDate
    );

    this.clinics = this.doctor['HealthEntityDTO'];
    // find clinic by id
    this.selectedClinic = this.clinics.ClinicId

    try {
      this.form.controls['clinic'].setValue(this.selectedClinic['ClinicId']);
      this.ClinicId = this.doctor['HealthEntityDTO']['ClinicId'];
      setTimeout(() => {
        document
          .getElementById('clinic-' + this.selectedClinic['ClinicId'])
          ?.click();
      }, 500);
    } catch (error) {}

    this.appointmentTypes = this.getAppointmentTypes();
    //on form value change
    this.form.valueChanges.subscribe((value) => {
      this.selectedAppointment=value.appointment
      ;

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
        //  Swal.fire({
        //       title : 'Already Booked',
        //       text : 'you can book again if you want',
        //       icon : 'info',
        //       showConfirmButton : false,
        //       timer : 2000
        //     }).then((result) => {
        //     })
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

  enumerateDaysBetweenDates(startDate:any, endDate:any) {
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

  getClinicSchedualByClinicDayId(day:any){

    this.spinner.show()
    this.form.controls['times'].setValue(null)
    const ClinicId = this.selectedClinic,
          DayId = day.id,
          MedicalExaminationTypeId = this.selectedAppointment,
          BookDate = day.date;
    this.service.getClinicSchedualByClinicDayId(ClinicId,DayId,MedicalExaminationTypeId,BookDate).subscribe(res => {
    if(res['Data'].length>0)
    {
      this.BookedAppointments=[];
      var BookedAppointments=res['Data'][0].BookedAppointments;
      BookedAppointments.forEach ((a:any)=>{
        var time= a.split(' ')[1];
      this.BookedAppointments.push(time);
      })
    }
      res['Data'].forEach((element:any) => {
        this.fees=element.Fees;
        sessionStorage.setItem  ('Fees',element.Fees);

        if(element.MaxNoOfPatients == null){

          element['times'] = this.timeInterval(element.TimeFrom, element.TimeTo, element.TimeInterval)
          return
        }else{
          element['times'] = this.timeInterval(element.TimeFrom, element.TimeTo, (this.getMinutesCount(element.TimeFrom,element.TimeTo) / element.MaxNoOfPatients ))
          element['times'].pop()
          return
        }
      });
      this.times = res['Data']
      if(res['Data'].length > 0){
        this.selectedDayId = res['Data'][0]['SchedualId']
      }
      this.spinner.hide()
    })
  }

  timeInterval(startTime:any,endTime:any,add:any = 30){

    var times  :any= [];
    var start :any = moment(startTime, "HH:mm");
    var end = moment(endTime, "HH:mm");
    while (start <= end) {
       var Booked=this.BookedAppointments.indexOf(start.format("HH:mm")) > -1
      times.push({
        time24: start.format("HH:mm"),
        time12: start.format("hh:mm A"),
         IsBooked:Booked
      });
      start.add(add, "minutes");
    }
    return times;
  }

  getMinutesCount(timeFrom:any,timeTo:any){
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
        minutes = (hours * 60) - minutesFrom + minutesTo;
    }
    else {
        minutes = minutesTo - minutesFrom;
    }
    return minutes;

  }
  selectedDayId = null;
  setSelectedDayId(day:any){
  }
  getAppointmentTypes(){

    return JSON.parse(localStorage.getItem('doctor') || '{}')['MedicalExamationTypes']
  }
  get f() {return this.form.controls}

  submit(){

    var isBooked=this.BookedAppointments.indexOf(this.form.value.times) > -1
    if(isBooked)
    {
   Swal.fire({
        title : 'Already Booked',
        text : 'you can book again if you want',
        icon : 'info',
        showConfirmButton : false,
        timer : 2000
      }).then((result) => {
      })
    }
    else
    {
    this.submitted = true;
    if (this.form.invalid) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      return
    }

   const form = {
      DoctorId: this.doctor['doctorDto']['Id'],
      DoctorWorkingDayTimeId: this.selectedDayId,
      // SchedualId
      AppointmentDate: `${this.form.value.appointmentDay}T${this.form.value.times}`,
      Fees: this.doctor.PriceAfter,
      Comment: '-',
      IsBook: true,
      HealthEntity_OffersID:this.doctor.Id
   }

      // Swal confirm
    Swal.fire({
      title: this.translocoService.translate('swal.confirmBooking.title'),
      text: this.translocoService.translate('swal.confirmBooking.text'),
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText : this.translocoService.translate('swal.confirmBooking.cancelButtonText'),
      confirmButtonText: this.translocoService.translate('swal.confirmBooking.confirmButtonText')
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.spinner.show()



        this.service.createPatientappointment(form).subscribe(res => {
          this.spinner.hide()

          const bookingOfferData = {
            doctor : this.doctor,
            clinic : this.selectedClinic,
            appointment : this.selectedAppointment,
            day : this.form.value.appointmentDay,
            time : this.form.value.times,
            HealthEntity_OffersID:this.doctor.Id
          }
          // localStorage.setItem('bookingData',JSON.stringify(bookingOfferData))
          // this.router.navigate(['/patient/booking-successfully-offer'])
          this.storage.setItem('bookingData',bookingOfferData)
          this.router.navigate([this.routesPipe.transform('booking-successfully-offer')],
     )

        })

      }else{
        Swal.fire({
          title : 'booking canceled',
          text : 'you can book again if you want',
          icon : 'info',
          showConfirmButton : false,
          timer : 2000
        }).then((result) => {
          // window.location.reload()
        })
      }
    })
  }
  }
  getLanguage() {
    return this.translocoService.getActiveLang();
  }
  chooseClinic(event:any,ClinicId:any){
    // var ClinicId = event.target.attributes[8].value;
    if(event.target.checked){
      this.selectedClinic = this.clinics.ClinicId
    }
  }
}
