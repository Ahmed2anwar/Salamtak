import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RoutesPipe } from '../../../pipes/routes.pipe';

@Component({
  selector: 'app-reset-successfully',
  standalone: true,
  imports: [TranslocoModule,RouterModule,RoutesPipe],
  templateUrl: './reset-successfully.component.html',
  styleUrl: './reset-successfully.component.scss'
})
export class ResetSuccessfullyComponent {
  lang = this.translocoService.getActiveLang();
  constructor(
    private translocoService: TranslocoService
  ) {
    
  }
}
