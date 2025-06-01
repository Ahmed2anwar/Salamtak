import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { AppService } from '../../services/app.service';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-pharmacies',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    AccordionModule,
    FormsModule
  ],
  templateUrl: './pharmacies.component.html',
  styleUrl: './pharmacies.component.scss'
})
export class PharmaciesComponent {
  data :any = {
    Items : [],
    // TotalCount : 0
  }
  cities :any = []
  CityId :any = null
  areas :any = []
  areaId :any = null
  loading = false
  storageUrl = environment.storageUrl;
  public doctorViewerOptions: any = {
    navbar: false,
    toolbar: false,
    title: false,
    movable: false,
  };
  private HealthEntityPagedList = 5
  public filterObject :any;

  constructor(
    private service : AppService,
    private spinner :NgxSpinnerService,
    private translocoService : TranslocoService,
    private metadataService : MetadataService
  ) { }

  ngOnInit(): void {
    this.metadataService.updateMetadata('pharmacies');

    this.getHealthEntityPagedList()
    this.getCities()
  }
  getHealthEntityPagedList(MaxResultCount = 10, SkipCount = 0,filters = false){
    this.loading = true
    var filter = {
      "MaxResultCount": MaxResultCount,
      "SkipCount": SkipCount,
      ...(this.CityId && {CityId: +this.CityId}),
      ...(this.areaId && {AreaId: +this.areaId}),
    }

    this.filterObject = filter
    this.spinner.show()
    this.service.getHealthEntityPagedList(this.HealthEntityPagedList,filter).pipe(map(res=>res['Data'])).subscribe(res=>{
      // this.doctors = [...this.doctors, ...res]
      this.data.TotalCount = res.TotalCount

      if(!filters){
        this.data.Items = [...this.data.Items, ...res.Items]
      }else{
        this.data.Items = res.Items
      }
      setTimeout(() => {
        this.loading = false
      }, 1000);
      this.spinner.hide()
    })
  }

  handleImageError(text = '',e:any){
    return e.target.src = `https://ui-avatars.com/api/?name=${text}&background=222161&color=fff`;
  }
  getCities() {
    this.service.getCitiesBycountryId(1).subscribe((res:any) => {

      this.cities = res.Data
    })
  }
  getAreasByCityId(cityId: any) {
    this.service.getAreas(cityId).subscribe((res:any) => {
      this.areas = res.Data
    })
  }
  convertToArabicNumber(input: any) {

    const lang = this.translocoService.getActiveLang();

    const arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    if (lang === 'ar')  {
      return input.replace(/\d/g, (match:any) => arabicNumbers[match]);

    }else{
      return input;
    }
  }
  converter(inp:any){
    const arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return inp.replace(/\d/g, (match:any) => arabicNumbers[match]);

  }
  copyToClipboard(phoneNumber: string): void {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      // Optional: Provide user feedback
      alert('Phone number copied!');
    }).catch(err => {
      console.error('Failed to copy!', err);
    });
  }
}
