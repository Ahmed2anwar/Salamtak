import { Component, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AppService } from '../../../services/app.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@Component({
  selector: 'app-rate',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
  ],
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.scss'
})

export class RateComponent {
  rate = 0
  comment = ''
  storageUrl = environment.storageUrl

  constructor(public dialogRef: MatDialogRef<RateComponent> , @Inject(MAT_DIALOG_DATA) public data: any,
    private service : AppService,
    private spinner: NgxSpinnerService,
  ){
  }
  saveRating(){
    
    if(!this.rate){
      // alert('من فضلك اختر التقيم')
      Swal.fire({
        icon: 'error',
        title: 'من فضلك اختر التقيم',
        showConfirmButton: false,
        timer: 1500
      })
      return


    }
       const form = {
        DoctorId : this.data.doctor.DoctorId,
        Rate : this.rate,
        Comment : this.comment
      }
      this.spinner.show()
      this.service.createDoctorRate(form).subscribe(res=>{
        Swal.fire({
          icon: 'success',
          title: 'تم التقييم بنجاح',
          showConfirmButton: false,
          timer: 1500
        })
        this.spinner.hide()
        this.dialogRef.close({
          event: 'close',
        })
      })
  }
}
