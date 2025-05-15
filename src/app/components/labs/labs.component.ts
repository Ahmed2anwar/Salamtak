import { Component } from '@angular/core';
import { map } from 'rxjs';
import { AppService } from '../../services/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MetadataService } from '../../services/metadata.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [
    TranslocoModule,
    AccordionModule,
    RouterModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule

],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.scss'
})
export class LabsComponent {
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
  private HealthEntityPagedList = 3
  public filterObject :any;


  //new for labs
  labs: any[] = [];
  typeId: number = 1; // Default typeId
  isLoading: boolean = false;
  errorMessage: string = '';
  analysisTypes: any[] = [];
  selectedTypeIds: number[] = []; // Multiple selected IDs
  showWarning: boolean = false;
  //selectedTypeIds: number[] = []; // Store selected analysis types
  showAnalysisWarning: boolean = false;

  isAnalysisCollapsed: boolean = true; // Initially collapsed
  labId: number | null;




  constructor(
    private service : AppService,
    private spinner :NgxSpinnerService,
    private translocoService : TranslocoService,
    private metadataService : MetadataService,
    private route: ActivatedRoute,
    private router: Router // Inject Router

  ) { }

  ngOnInit(): void {
    this.metadataService.updateMetadata('laboratories');

    this.getHealthEntityPagedList()
    this.getCities()

    //New For LAbs.
   // Fetch labs based on query params
    this.route.queryParams.subscribe(params => {
      this.typeId = params['typeId'] || 1;
      this.fetchLabs();
    });

    // Fetch available analysis types
    this.fetchAnalysisTypes(this.typeId);

    this.route.queryParams.subscribe(params => {
      this.labId = params['labId'] ? Number(params['labId']) : null;
      this.typeId = params['typeId'] ? Number(params['typeId']) : 1;
      this.analysisTypes = params['analysisIds'] ? params['analysisIds'].split(',').map(Number) : [];
    });

    console.log('Lab ID:', this.labId);
    console.log('Selected Analysis:', this.analysisTypes);
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


  // Fetch available analysis types
  fetchAnalysisTypes(typeId: number) {
    this.service.getServicesByType(typeId).subscribe({
      next: (response: any) => {
        if (response?.Success && response?.Data) {
          this.analysisTypes = response.Data;
        } else {
          this.analysisTypes = [];
        }
      },
      error: (error) => {
        console.error('Error fetching analysis types:', error);
      }
    });
  }

  onAnalysisTypeChange(typeId: number, event: any) {
    if (event.target.checked) {
      this.selectedTypeIds.push(typeId);
    } else {
      this.selectedTypeIds = this.selectedTypeIds.filter(id => id !== typeId);
    }
    //fetch filter labs when analysis type selected
    this.fetchLabsByFilter();
  }

  fetchLabsByFilter() {
    const payload = {
      typeId: 1, // Keep this 1 as per your requirement
      serviceIds: this.selectedTypeIds
    };

    this.isLoading = true;
    this.service.getLabsByFilters(payload).subscribe({
      next: (response: any) => {
        console.log('Filtered Labs Response:', response);

        if (response?.Success && response?.Data) {
          this.labs = response.Data;
        } else {
          this.labs = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching filtered labs:', error);
        this.labs = [];
        this.isLoading = false;
      }
    });
  }

  // Default: Fetch all labs
  fetchLabs() {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getLabsByTypeId(this.typeId).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        if (response?.Success && response?.Data) {
          this.labs = response.Data;
        } else {
          this.labs = [];
          this.errorMessage = 'No labs found.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching labs:', error);
        this.errorMessage = 'Failed to fetch labs. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onBookNow(lab: any) {
    if (this.selectedTypeIds.length === 0) {
      this.showWarning = true;
      return;
    }
    this.showWarning = false;

    // Get the active language (en or ar)
    const currentLang = this.translocoService.getActiveLang();

    // Set the route dynamically based on the language
    const routePath = `${currentLang}/bookingserviceType`;

    // Navigate to the correct language-based route
    this.router.navigate([routePath], {
      queryParams: { labId: lab.Id, analysisIds: this.selectedTypeIds.join(','), typeId: this.typeId }
    });
  }
  // Get Image URL
  getImageUrl(imagePath: string): string {
    return `https://salamtechapi.azurewebsites.net${imagePath}`;
  }


  toggleAnalysisList() {
    this.isAnalysisCollapsed = !this.isAnalysisCollapsed;
  }


}
