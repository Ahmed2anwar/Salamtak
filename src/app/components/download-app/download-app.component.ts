import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-download-app',
  standalone: true,
  imports: [TranslocoModule,
    CommonModule
  ],
  templateUrl: './download-app.component.html',
  styleUrl: './download-app.component.scss',
})
export class DownloadAppComponent {
  constructor(private translocoService: TranslocoService) {}
  lang = this.translocoService.getActiveLang();
}
