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

@Component({
  selector: 'app-poly-clinic-doctors',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    SearchFormComponent,
    AccordionModule,
    FormsModule,
    RoutesPipe
  ],
  templateUrl: './poly-clinic-doctors.component.html',
  styleUrl: './poly-clinic-doctors.component.scss'
})
export class PolyClinicDoctorsComponent {
  constructor(
    private StorageService : LocalStorageService,
    private service : AppService,
    private form : SearchFormService,
    private route: ActivatedRoute,
    private mktService:  MarketingService,
    private translocoService: TranslocoService,
    private spinner :NgxSpinnerService,
    private router: Router,
    private metadataService : MetadataService,
    private routesPipe : RoutesPipe
  ) {

      this.route.queryParams.subscribe(params => {
        this.ClinicId = params['ClinicId']
    });

  }
  ClinicId :any
  storageUrl = environment.storageUrl;
  public doctors : any = [];
  loading = false
  lang :any = this.translocoService.getActiveLang()
  public doctorViewerOptions: any = {
    navbar: false,
    toolbar: false,
    title: false,
    movable: false,
  };


  bookFor(event:any,doctor:any){
    
    event.preventDefault()
    const eventData: any = this.mktService.setEventData(
      'Patient Booked Doctor Appointment',
      `View Doctor Profile`,
      " ",
    );

      // this.router.navigate([`/${this.lang}/doctor-profile/${doctor.Id}`], { queryParams: {
        this.router.navigate([this.routesPipe.transform('doctor-profile',doctor.Id,doctor.DoctorName)], { queryParams: {
          
      DoctorId : doctor.Id,
      ClinicId : doctor.ClinicID,
     } }).then((res:any)=>{
      // MedicalExamationTypes not found for {Doctor/GetDoctorProfileByDoctorId} api so i save it in localstorage  to use it in doctor-profile component
      this.StorageService.setItem('doctor',JSON.stringify(doctor))
      this.StorageService.setItem('DoctorFees',doctor.FeesFrom);

    })
  }
  async ngOnInit(): Promise<void> {
    this.metadataService.updateMetadata('poly-clinic-doctors');

   await this.getDoctors()
  }
    async getDoctors(value :any = null){
    
    this.loading = true;
    this.spinner.show()

      this.service.GetDoctorPolyClinic(this.ClinicId).subscribe((res:any)=>{
      // .pipe(map(res=>res['Data']))
      this.doctors = res['Data']
      this.spinner.hide()

    })

      this.loading = false


  }
  goToDocProfile(doctor:any){
    this.router.navigate([this.routesPipe.transform('doctor'),doctor.DoctorId , doctor.DoctorName]
    // this.router.navigate([this.routesPipe.transform('doctor-profile')]
    , { queryParams: {
      DoctorId : doctor.DoctorId,
      ClinicId : doctor.clinicDto.ClinicId,
      // AvalibleDate : this.params['AvalibleDate']
    }})
  }
  replaceSpaceWithDash(name:any){
    return name?.replace(/ /g, '-');
  }
}
