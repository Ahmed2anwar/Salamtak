import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { RoutesPipe } from '../pipes/routes.pipe';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
       TranslocoModule,
        RouterModule,
        CommonModule,
        RoutesPipe
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

}
