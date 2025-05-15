import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RoutesPipe } from '../../pipes/routes.pipe';

export interface AnswerData {
  date: string;
  doctorId: number;
  doctorName: string;
  answer: string;
}

@Component({
  selector: 'app-answer-popup',
  standalone: true,
  imports:[
    TranslocoModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './answer-popup.component.html',
  styleUrls: ['./answer-popup.component.scss']
})
export class AnswerPopupComponent {
  Answer:any=[]
  constructor(
    public dialogRef: MatDialogRef<AnswerPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private routePipe: RoutesPipe
  ) {}

  ngOnInit(): void {

    this.Answer=this.data.answers

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  bookAppointment(doctorId:any): void {

    // Implement booking logic here
    // console.log(`Booking appointment with doctor: ${this.data.doctorName}`);
    this.router.navigate(['/patient/doctor-profile', doctorId]);
    //this.router.navigate([this.routePipe.transform('doctor-profile',doctorId)])
    this.dialogRef.close();
  }
}
