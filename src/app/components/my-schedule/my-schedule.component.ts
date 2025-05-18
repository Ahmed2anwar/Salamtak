import { Component, ViewEncapsulation } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { languages } from '../../languages';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { RateComponent } from '../@popups/rate/rate.component';
import { LocalStorageService } from '../../services/local-storage.service';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    SearchFormComponent,
    AccordionModule,
    FormsModule,
    MatTabsModule,
    MatMenuModule,RoutesPipe,
    TableModule
  ],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MyScheduleComponent {

  date = null;
  lat:any;
  long :any;
  data :any ;
  todayDate:any;
  eventType = 0
  storageUrl = environment.storageUrl
  loading = false
  public IsArabic:any;
  public IsEnglish:any;
  address:any
  area:any
  floor:any;
  appartment:any;
  languages = languages;
  selectedLanguage = this.languages[0];
  lang = this.translocoService.getActiveLang();
  constructor(
    private dialog: MatDialog,
    private service : AppService,
    private spinner: NgxSpinnerService,
    private router: Router,private translocoService: TranslocoService,
    private StorageService : LocalStorageService,
    private metadataService : MetadataService,
    private routesPipe: RoutesPipe
  ) {
    // this.editAppointment()
  }
  ngOnInit(): void {
    this.metadataService.updateMetadata('my-schedule');



    this.changeEventType({index:0})
    const lang = this.translocoService.getActiveLang();
    if (lang) {
       if (lang === 'ar') {
       this.IsEnglish=false;
       this.IsArabic=true;
       this.floor="رقم الدور"
       this.appartment="رقم الشقة"
        // window.open('/termsAr')

      }
      else {
        this.IsEnglish=true;
        this.IsArabic=false;
        this.floor="رقم الدور"
        this.appartment="رقم الشقة"



      }
      
      

 }

  this.area=this.data.CityName+" "+this.data.AreaName;
 this.address = this.data.Address;
 if(this.data.FloorNo != null && this.data.FloorNo!='0'){

   this.address=this.address+" "+  this.floor+" "+this.data.FloorNo;
 }

 if(this.data.ApartmentNo != null && this.data.ApartmentNo!='0'){

   this.address=this.address+" "+this.appartment+" "+this.data.ApartmentNo ;
 }

   }

  changeEventType(e:any){
    this.eventType = e.index
    this.data = []
    switch (e.index) {
      case 0:
        this.getUpcomingAppointmentes()
        break;
      case 1:
        this.getMedicalHistoryAppointmentes()
        break;
      case 2:
        this.getCanceledAppointmentes()
        break;
      default:
        break;
    }
  }

  getUpcomingAppointmentes(){

    this.spinner.show()
    this.loading = true
    this.service.getUpcomingAppointmentes().subscribe(res=>{
      this.data = res['Data']
      this.spinner.hide()
      this.loading = false
      this.data.forEach((e:any) => {
        ;
        var s=e;

        if(e.FloorNo != null && e.FloorNo!='0'){

          e.ClinicAddress=e.ClinicAddress+" "+  this.floor+" "+e.FloorNo;
        }

        if(e.ApartmentNo != null && e.ApartmentNo!='0'){

          e.ClinicAddress=e.ClinicAddress+" "+this.appartment+" "+e.ApartmentNo ;
        }
      });

    })
    console.log(this.data);
  }
  getMedicalHistoryAppointmentes(){
    this.spinner.show()
    this.loading = true
    this.service.getMedicalHistoryAppointmentes().subscribe(res=>{
      this.data = res['Data']
      this.spinner.hide()
      this.loading = false
    })
  }
  getCanceledAppointmentes(){
    this.spinner.show()
    this.loading = true

    this.service.getCanceledAppointmentes().subscribe(res=>{
      // console.clear()
      this.data = res['Data']
      this.spinner.hide()
      this.loading = false

    })
  }
  // getUpcomingAppointmentes() {
  //   return this.http.get<any>(`${environment.apiUrl}/PatientAppointment/GetUpcomingAppointmentes`)
  // }
  // getMedicalHistoryAppointmentes() {
  //   return this.http.get<any>(`${environment.apiUrl}/PatientAppointment/GetMedicalHistoryAppointmentes`)
  // }
  // getCanceledAppointmentes() {
  //   return this.http.get<any>(`${environment.apiUrl}/PatientAppointment/GetCanceledAppointmentes`)
  // }
  // getPatientAppointmentes(){
  //   this.service.getPatientAppointmentes().subscribe(res=>{
  //     console.clear()
  //     this.data = res['Data']

  //     // •ف الupcomingلو التاريخ اكبر من الcurrent dateوال isCancelبfalse
  //     var upComing = this.data.filter((item:any)=>{
  //       return new Date(item.AppointmentDate) > new Date() && item.isCancel == false
  //     })
  //     // •الMedical historyده لوIsCompletedبtrue
  //     var medicalHistory = this.data.filter((item:any)=>{
  //       return item.IsCompleted == true
  //     })
  //     //•الCanceledلوIsCancelبTrue
  //     var canceled = this.data.filter((item:any)=>{
  //       return item.isCancel == true
  //     })



  //   })
  // }

  goToMedical(doctor:any){
  // this.router.navigate([`/${this.lang}/medical`,doctor.AppointmentId])
    this.router.navigate([this.routesPipe.transform('medical') ,doctor.AppointmentId])


  }
  RebookAppointment(doctor:any):void{

    this.todayDate = new Date().toISOString().split('T')[0]
      // this.router.navigate([`/${this.lang}/doctor-profile`,doctor.DoctorId ]) ,{ queryParams: {
        // [routerLink]="[('doctor-profile'  | route ), doctor['DoctorId'], doctor['DoctorName']]"
        this.router.navigate([this.routesPipe.transform('doctor'),doctor.DoctorId , this.replaceSpaceWithDash(doctor.DoctorName)]) ,{ queryParams: {
        DoctorId : doctor.DoctorId,
        ClinicId : doctor.ClinicId,
        AvalibleDate : this.todayDate
       } }
  }

  editAppointment(doctor:any): void {



    // this.spinner.show()
    var AppointmentId = doctor['AppointmentId']
    // this.rate(doctor)
    // this.service.cancelAppointment(AppointmentId).subscribe(res=>{
      this.StorageService.setItem('EditAppointmentID', AppointmentId);

      //  this.router.navigate([`/${this.lang}/doctor-profile`,doctor['DoctorId']])
       this.router.navigate([this.routesPipe.transform('doctor'),doctor['DoctorId'], this.replaceSpaceWithDash(doctor['DoctorName'])])
        ,{ queryParams: {
        DoctorId : doctor.DoctorId,
        ClinicId : doctor.ClinicId,
       } }
      // this.spinner.hide()
    // })


    // const dialogRef = this.dialog.open(EditAppointmentComponent, {
    //   data: {
    //     doctor : doctor
    //   },
    //   width: '600px',
    //   height: 'auto',
    //   maxHeight: '90vh',

    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }
  help(){
    // ContactUsComponent
    this.dialog.open(ContactUsComponent, {
      width: '500px',
      // height: '500px',
      data: {}
    });
  }
  // RateComponent
  rate(doctor:any){
    const dialogRef = this.dialog.open(RateComponent, {
      width: '500px',
      data: {
        doctor : doctor
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'close'){
        this.changeEventType({index:1})
      }
    })


  }


  map(doctor:any){

    // ContactUsComponent
if( doctor['ClinicLatitude'] !=null && doctor['ClinicLongitude'])
{
  this.lat=doctor['ClinicLatitude']
  this.long =doctor['ClinicLongitude']
    // this.dialog.open(MapboxComponent, {

    //   data: {
    //     latitude : doctor['ClinicLatitude'],
    //     longitude : doctor['ClinicLongitude'],
    //   }
    // });
    window.open('https://www.google.com/maps/search/?api=1&query='+this.lat+','+this.long)
   }
  else
  {
    Swal.fire({
      icon: 'error',
      title: this.translocoService.translate('swal.confirmBooking.sorry'),
      showConfirmButton: false,
      timer: 2500
    })
    return
    }
    // window.open("https://www.google.com/maps/search/?api=1&query={{doctor.Latitude}},{{doctor.Longitude}}")
  }
  //
  cancelAppointment(AppointmentId:any,DoctorId:any = null,doctorName:any = null){
    Swal.fire({
      title: this.translocoService.translate('swal.confirmBooking.cancelap'),
      html: '<img src="assets/icons/cancel-appointment2.svg">',
      showCancelButton: true,
      cancelButtonColor: '#CB544B',
      cancelButtonText: this.translocoService.translate('swal.confirmBooking.re'),
      confirmButtonText: this.translocoService.translate('swal.confirmBooking.can'),
      customClass: 'cancel-appointment-swal-modal'
    }).then((result) => {
      if (result.value) {
        this.spinner.show()


        this.service.cancelAppointment(AppointmentId).subscribe(res=>{
          this.spinner.hide()
          Swal.fire(
            'Cancelled!',
            'Your appointment has been cancelled.',
            'success'
          ).then(()=>{
            this.changeEventType({index:0})
          })
        })
      }
      // on cancelButtonText click
      else if (result.dismiss === Swal.DismissReason.cancel) {
        this.spinner.show()
        this.service.cancelAppointment(AppointmentId).subscribe(res=>{
          this.spinner.hide()
          // go to doctor profile
          // patient/doctor-profile/26
          /*
          * 	 path => import { Router } from '@angular/router';
          * 	 param =>
          */
          // this.router.navigate([`/${this.lang}/doctor-profile`,DoctorId])
          this.router.navigate([this.routesPipe.transform('doctor'),DoctorId, this.replaceSpaceWithDash(doctorName)])

        })
      }
    })
  }

    returnWeekDay(item: any) {

      var dt=item.substring(0,10)
      var tm= item.substring(11)
      var h=tm.split(':')[0]
      var minu=tm.split(':')[1]
      var y=dt.split('-')[0]
      var m= parseInt( dt.split('-')[1])-1
      var d=dt.split('-')[2]
      const lang = this.translocoService.getActiveLang();
      this.convertTime24to12(tm)
      const date = new Date(y,m,d,h,minu)


      const options:any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour12: true, hour: "numeric", minute: "numeric" };
      if (lang === 'ar')  {
        return new Intl.DateTimeFormat("ar-EG", options).format(date);

      }else{

        return new Intl.DateTimeFormat("en-US", options).format(date);
      }
    }

    convertTime24to12(time24h:any) {
      let [hours, minutes] = time24h.split(':');
      let time12h = new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
      const lang =this.translocoService.getActiveLang();
      if (lang === 'ar')  {
        return time12h.toLocaleTimeString('ar-EG', { hour12: true, hour: "numeric", minute: "numeric" });

      }else{

        return time12h.toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric" });
      }

    }
    goToProfile(doctor:any){
        //console.log(doctor)
        this.router.navigate([this.routesPipe.transform('doctor'),doctor.DoctorId , this.replaceSpaceWithDash(doctor.DoctorName)]
        // this.router.navigate([this.routesPipe.transform('doctor-profile')]
        , { queryParams: {
          ClinicId : doctor.ClinicId,
          Specialist : this.replaceSpaceWithDash(doctor.SpecialistName)
        }
      })
    }

    replaceSpaceWithDash(name:any){
      return name?.replace(/ /g, '-');
    }
}
// http://localhost:4200/en/doctor/14/Atef-Mohamed-Ezzat?ClinicId=4004&Specialist=Gynaecology-and-Infertility
