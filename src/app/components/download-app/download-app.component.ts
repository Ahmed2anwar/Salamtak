import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-download-app',
  standalone: true,
  imports: [
    TranslocoModule
  ],
  templateUrl: './download-app.component.html',
  styleUrl: './download-app.component.scss'
})
export class DownloadAppComponent {

}
