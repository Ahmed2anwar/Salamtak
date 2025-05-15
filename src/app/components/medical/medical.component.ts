import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { AppService } from '../../services/app.service';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-medical',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    SearchFormComponent,
    AccordionModule,
    FormsModule
  ],
  templateUrl: './medical.component.html',
  styleUrl: './medical.component.scss'
})
export class MedicalComponent {
  @Input() PatientId : any;
  // @Input() AppointmentId;

  public EmrHistory : any
   public AppointmentId = this.route.snapshot.paramMap.get('AppointmentId')

  public EmrDetails : any
  storageUrl = environment.storageUrl;
  instruction:any = null
  rxTitle :any = null
  rxDescription :any = null
  showAddButton = false
  constructor(private patient:AppService,private spinner:NgxSpinnerService, public route: ActivatedRoute,
    private metadataService : MetadataService
    ) {
    this.inputSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.onDiagnosisInputChange();
    });
  }

  ngOnInit(): void {
    this.metadataService.updateMetadata('medical');

      this.getPatientEmrDetails()
  }


  // get data from patient emr details
  getPatientEmrDetails(AppointmentId = this.AppointmentId){
    this.spinner.show()
    this.patient.getPatientEmrDetails(AppointmentId).subscribe((res:any)=>{
      //console.log(res)
      this.EmrDetails = res['Data'];

      this.spinner.hide()
    })
  }

  addInstruction(instruction:any){
    const form = {
      "AppointmentId" : Number(this.AppointmentId),
      "Instructions" : instruction
    }
    this.spinner.show()

  }


  addRx(rxTitle:any,rxDescription:any){
    if(rxTitle == null || rxDescription == null){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill all fields',
        timer: 600,
        showConfirmButton: false
      })
      return
    }
    const form = {
      "AppointmentId" : Number(this.AppointmentId),
      "Title" : rxTitle,
      "Description" : rxDescription
    }
    this.spinner.show()

  }

  uploadFiles(e:any){
    if(e.target.files.length == 0){
      return
    }
    this.spinner.show()
    // loops through all files
    for (let index = 0; index < e.target.files.length; index++) {
      const file = e.target.files[index]
      const formData = new FormData()
      formData.append('document',file)


    }
    this.getPatientEmrDetails()
    this.spinner.hide()

    return
    // const file = e.target.files[0]
    // const formData = new FormData()
    // formData.append('document',file)
    // formData.append('appointmentId',this.AppointmentId)
    // this.spinner.show()
    // this.patient.createPatientEmrDocument(formData).pipe(map(res=>res['Data'])).subscribe(res=>{
    //   this.spinner.hide()
    //   Swal.fire({
    //     icon: 'success',
    //     title: 'Success',
    //     text: 'File uploaded successfully',
    //     timer: 600,
    //     showConfirmButton: false
    //   }).then(()=>{
    //     this.getPatientEmrDetails()
    //   })
    // })
  }

  private inputSubject = new Subject<string>();
  onDiagnosisInput(value:any){
    this.inputSubject.next(value);
  }
  onDiagnosisInputChange() {
    this.addInstruction(this.instruction)
  }
}
