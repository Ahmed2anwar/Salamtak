import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { RoutesPipe } from '../../pipes/routes.pipe';

export interface AnswerData {
  Answer: string;
  AnswerDate: string;
  ClinicID: number;
  DoctorID: number;
  DoctorName: string;
}

@Component({
  selector: 'app-answer-popup',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    RoutesPipe,
  ],
  templateUrl: './answer-popup.component.html',
  styleUrls: ['./answer-popup.component.scss']
})
export class AnswerPopupComponent implements OnInit {
  Answer: AnswerData[] = [];

  constructor(
    public dialogRef: MatDialogRef<AnswerPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public routesPipe: RoutesPipe,
  ) { }

  ngOnInit(): void {
    this.Answer = this.data.answers || [];
    console.log("Answers loaded:", this.Answer);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  bookFor(item: AnswerData) {
    if (!item) return;
    const doctorName = this.encodeNameForUrl(item.DoctorName);
    this.router.navigate(
      [
        this.routesPipe.transform('doctor'),
        item.DoctorID,
        doctorName
      ],
      {
        queryParams: {
          DoctorId: item.DoctorID,
          ClinicId: item.ClinicID,
        }
      }
    );

    this.dialogRef.close();
  }

  private encodeNameForUrl(name: string): string {
    return encodeURIComponent(name?.trim().replace(/\s+/g, '-'));
  }
}
