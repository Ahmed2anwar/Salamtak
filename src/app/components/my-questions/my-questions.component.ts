import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CommonModule, DatePipe } from '@angular/common';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { Router } from '@angular/router';

export interface AnswerData {
  Answer: string;
  AnswerDate: string;
  ClinicID: number;
  DoctorID: number;
  DoctorName: string;
}

@Component({
  selector: 'app-my-questions',
  standalone: true,
  imports: [
    TranslocoModule,
    CommonModule,
    DatePipe
  ],
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss']
})

export class MyQuestionsComponent {
  questions: any[] = [];
  constructor(
    private service: AppService,
    private spinner: NgxSpinnerService,
    private transloco: TranslocoService,
    public routesPipe: RoutesPipe,
     private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllQandAByPatientId();
  }

  getAllQandAByPatientId() {
    this.spinner.show();
    this.service.GetAllQandAByPatientId().subscribe({
      next: (res: any) => {
        this.questions = res.Data || [];
        console.log('my questions', this.questions);
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error fetching questions', err);
        this.spinner.hide();
      }
    });
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
  
   
    }
  
    private encodeNameForUrl(name: string): string {
      return encodeURIComponent(name?.trim().replace(/\s+/g, '-'));
    }
}
