import { Component } from '@angular/core';
import { RoutesPipe } from '../pipes/routes.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../services/app.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MetadataService } from '../services/metadata.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [RouterModule, TranslocoModule, CommonModule, RoutesPipe],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
})
export class GuideComponent {
  medicalServices = [
    {
      icon: 'assets/phara.png',
      title: 'Pharmacies',
      translate: 'pharmacies',
      hex: 'rgba(16, 179, 174, 1)',
      url: this.route.transform('pharmacies'),
    },
    {
      icon: 'assets/labor.png',
      title: 'Laboratories',
      translate: 'laboratories',
      hex: 'rgba(219, 139, 67, 1)',
      url: this.route.transform('laboratories'),
    },

    {
      icon: 'assets/icons/radio.png',
      title: 'Radiology Centers',
      translate: 'radiology-center',
      hex: 'rgba(22, 144, 180, 1)',
      url: this.route.transform('radiology-center'),
    },
     {
      icon: 'assets/hosp.png',
      title: 'Hospitals',
      translate: 'hospitals',
      hex: 'rgba(43, 41, 121, 1)',
      url: this.route.transform('hospitals'),
    },
    {
      icon: 'assets/icons/angelmmm 1.png',
      title: 'RadiologyCenter',
      translate: 'emergency',
      hex: 'rgba(197, 98, 81, 1)',
      url: this.route.transform('SalamtakAngel'),
    },
  ];
  constructor(
    private spinner: NgxSpinnerService,
    private patientService: AppService,
    private translocoService: TranslocoService,
    private service: AppService,
    private metadataService: MetadataService,
    private route: RoutesPipe
  ) {}
}
