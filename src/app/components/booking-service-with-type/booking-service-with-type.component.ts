import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-booking-service-with-type',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule
  ],
  templateUrl: './booking-service-with-type.component.html',
  styleUrl: './booking-service-with-type.component.scss'
})
export class BookingServiceWithTypeComponent {
  
    lab = {
      name: 'Elite Medical Lab',
      imageUrl: 'https://fakeimg.pl/350x200/?text=My Lab&font=lobster'
    };
  
    analyses = [
      { name: 'Blood Test', price: '$50' },
      { name: 'X-Ray', price: '$80' },
      { name: 'MRI Scan', price: '$200' }
    ];
  
    availableDays = [
      { name: 'Monday', number: '04' },
      { name: 'Wednesday', number: '06' },
      { name: 'Friday', number: '08' }
    ];
  

    constructor( private translocoService : TranslocoService,
    ){

    }

    deleteAnalysis(index: number) {
      this.analyses.splice(index, 1);
    }
}
  

