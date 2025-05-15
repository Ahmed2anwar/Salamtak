import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
//import { AnswerPopupComponent } from '../answer-popup/answer-popup.component';
import { AppService } from '../../services/app.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnswerPopupComponent } from '../answer-popup/answer-popup.component';



@Component({
  selector: 'app-questions-answers',
  standalone: true,
  imports:[
    TranslocoModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './questions-answers.component.html',
  styleUrls: ['./questions-answers.component.scss'],
})
export class QuestionsAnswersComponent {
  questions: any = [];
  loading = false;
  have:any =false;
  constructor(public dialog: MatDialog, private service: AppService,private spinner: NgxSpinnerService, private transloco : TranslocoService,
  ) {
    this.getAllQandA()
    this.have=false
  }
  ngOnInit(): void {
     this.getAllQandA()
  }

  showAnswers(question: any): void {

    const answerData: any = {
      // date: question.date,
      // doctorId: question.id,
      // doctorName: 'Dr. Smith',
      // answer: 'This is the answer to your question.'
      answers:question.getAnswers
    };

  this.dialog.open(AnswerPopupComponent, {
    width: '600px',
    height: '400px',
    data: answerData
  });
}

  getAllQandA() {
    this.spinner.show();
    this.service.getAllQandA().subscribe((res:any) => {
      //console.log(res.Data)
      this.loading = true;
      this.questions = res.Data
      if(this.questions.lenght>0){
        this.have=true
      }
      this.spinner.hide();
    })
  }
}
