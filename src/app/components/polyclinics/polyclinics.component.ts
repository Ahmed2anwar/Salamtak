import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-polyclinics',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    RoutesPipe,
  ],
  templateUrl: './polyclinics.component.html',
  styleUrl: './polyclinics.component.scss',
})
export class PolyclinicsComponent {
  data: any = {
    Items: [],
    TotalCount: 0,
  };
  cities: any = [];
  CityId: any = null;
  areas: any = [];
  areaId: any = null;
  loading = false;
  storageUrl = environment.storageUrl;
  public doctorViewerOptions: any = {
    navbar: false,
    toolbar: false,
    title: false,
    movable: false,
  };
  private HealthEntityPagedList = 6;
  public filterObject: any;
  lang: any = this.translocoService.getActiveLang();
  constructor(
    private service: AppService,
    private spinner: NgxSpinnerService,
    private translocoService: TranslocoService,
    private metadataService: MetadataService
  ) {}

  ngOnInit(): void {
    this.metadataService.updateMetadata('polyclinics');
    this.getHealthEntityPagedList();
    this.getCities();
    console.log(this.data);
  }
  getHealthEntityPagedList(filters = false) {
    this.loading = true;
    var filter = {
      ...(this.CityId && { CityId: +this.CityId }),
      ...(this.areaId && { AreaId: +this.areaId }),
    };

    this.filterObject = filter;
    this.spinner.show();
    this.service
      .getHealthEntityPagedListt(filter)
      .pipe(map((res) => res['Data']))
      .subscribe((res) => {
        // this.doctors = [...this.doctors, ...res]
        this.data = res;
        console.log(this.data);
        if (!filters) {
          this.data = [...this.data, ...res];
        } else {
          this.data = res;
        }
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        this.spinner.hide();
      });
  }

  handleImageError(text = '', e: any) {
    return (e.target.src = `https://ui-avatars.com/api/?name=${text}&background=222161&color=fff`);
  }
  getCities() {
    this.service.getCities().subscribe((res: any) => {
      this.cities = res.Data;
    });
  }
  getAreasByCityId(cityId: any) {
    this.service.getAreas(cityId).subscribe((res: any) => {
      this.areas = res.Data;
    });
  }
}
