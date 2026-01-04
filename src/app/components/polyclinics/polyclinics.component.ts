import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppService } from '../../services/app.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-polyclinics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslocoModule,
    AccordionModule,
    RoutesPipe,
  ],
  templateUrl: './polyclinics.component.html',
  styleUrl: './polyclinics.component.scss',
})
export class PolyclinicsComponent implements OnInit {


  data: any = {
    Items: [],
    TotalCount: 0,
  };

  cities: any[] = [];
  areas: any[] = [];

  CityId: number | null = null;
  areaId: number | null = null;

  loading = false;
  storageUrl = environment.storageUrl;
  lang = this.translocoService.getActiveLang();

  private HealthEntityTypeId = 6;

  public doctorViewerOptions: any = {
    navbar: false,
    toolbar: false,
    title: false,
    movable: false,
  };

  constructor(
    private service: AppService,
    private spinner: NgxSpinnerService,
    public translocoService: TranslocoService,
    private metadataService: MetadataService
  ) {}

  ngOnInit(): void {
    this.metadataService.updateMetadata('polyclinics');
    this.getHealthEntityPagedList();
    this.getCities();
  }


  getHealthEntityPagedList(reset = false) {
    this.loading = true;

    const filters: any = {
      ...(this.CityId && { CityId: +this.CityId }),
      ...(this.areaId && { AreaId: +this.areaId }),
    };

    console.log('Filters:', filters);

    this.spinner.show();

    this.service
      .getHealthEntityPagedList(this.HealthEntityTypeId, filters)
      .pipe(map(res => res.Data))
      .subscribe({
        next: (res) => {
          this.data.Items = res?.Items || [];
          console.log('Polyclinics:', this.data.Items);
          this.data.TotalCount = res?.TotalCount || 0;
        },
        error: (err) => {
          console.error('Polyclinics API Error', err);
        },
        complete: () => {
          this.loading = false;
          this.spinner.hide();
        }
      });
  }

  onCityChange(cityId: number) {
    this.CityId = cityId;
    this.areaId = null;
    this.areas = [];

    this.getAreasByCityId(cityId);
    this.getHealthEntityPagedList(true);
  }

  onAreaChange(areaId: number) {
    this.areaId = areaId;
    this.getHealthEntityPagedList(true);
  }

  handleImageError(text = '', e: any) {
    e.target.src = `https://ui-avatars.com/api/?name=${text}&background=222161&color=fff`;
  }

  getCities() {
    this.service.getCities().subscribe({
      next: (res: any) => {
        this.cities = res?.Data || [];
      },
      error: (err) => {
        console.error('Cities API Error', err);
      }
    });
  }

  getAreasByCityId(cityId: number) {
    this.service.getAreas(cityId).subscribe({
      next: (res: any) => {
        this.areas = res?.Data || [];
      },
      error: (err) => {
        console.error('Areas API Error', err);
      }
    });
  }
}
