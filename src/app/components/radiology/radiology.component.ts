import { Component } from '@angular/core';
import { map } from 'rxjs';
import { AppService } from '../../services/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MetadataService } from '../../services/metadata.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule } from '@angular/forms';
import { LabServiceService } from '../../services/LabService.service';

@Component({
  selector: 'app-radiology',
  standalone: true,
  imports: [
    TranslocoModule,
    AccordionModule,
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './radiology.component.html',
  styleUrl: './radiology.component.scss'
})
export class RadiologyComponent {
  data: any = {
    Items: [],
    // TotalCount : 0
  }
  cities: any = []
  CityId: any = null
  areas: any = []
  areaId: any = null
  loading = false
  storageUrl = environment.storageUrl;
  public doctorViewerOptions: any = {
    navbar: false,
    toolbar: false,
    title: false,
    movable: false,
  };
  private HealthEntityPagedList = 3
  public filterObject: any;

  //new for labs
  analyses: any[] = []; // Replace 'any' with your actual analysis interface
  selectedAnalyses: any[] = []; // Array to store selected analyses
  isDropdownOpen: boolean = false; // Dropdown visibility state
  labs: any[] = []; // Array to store labs
  selectedTypeIds: number[] = []; // Assuming typeId is 1 for lab booking
  showValidationMessage: boolean = false;
  selectedLabId: number | 1; // Store the selected lab ID
  labBranches: any[] = []; // Array to store lab branches
  typeId: number = 1;

  constructor(
    private service: AppService,
    private spinner: NgxSpinnerService,
    private translocoService: TranslocoService,
    private metadataService: MetadataService,
    private route: ActivatedRoute,
    private labService: LabServiceService
  ) { }

  ngOnInit(): void {
    //this.metadataService.updateMetadata('laboratories'); 

    this.fetchAnalyses();
    this.fetchLabs();
    //this.selectedLabId = this.labService.getSelectedLabId();
    console.log('Selected Lab ID in Analysis List:', this.selectedLabId);
  }

  onServiceCardClick(typeId: number): void {
    // Set typeId to 1 for lab booking
    const selectedTypeId = typeId === 1 ? 1 : typeId; // You can adjust this logic if needed

    // Call the API endpoint
    this.service.getServicesByType(selectedTypeId).subscribe(
      (response) => {
        console.log('Services fetched:', response);
        // Handle the response (e.g., update the UI with the fetched services)
        console.log('gfdf')
      },
      (error) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  fetchAnalyses(): void {
    const typeId = 1; // Assuming typeId for lab booking is 1
    this.service.getServicesByType(typeId).subscribe(
      (response) => {
        console.log('API Response:', response); // Log the response
        if (response && response.Success && Array.isArray(response.Data)) {
          this.analyses = response.Data; // Extract the Data array
          console.log('Analyses Data:', this.analyses); // Log the extracted data
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching analyses:', error);
      }
    );
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onAnalysisSelect(analysis: any): void {
    console.log('Analysis selected:', analysis); // Log the analysis object
    const index = this.selectedAnalyses.findIndex((a) => a.id === analysis.id);
    if (index === -1) {
      this.selectedAnalyses.push(analysis); // Add to selected list if not already selected
    } else {
      this.selectedAnalyses.splice(index, 1); // Remove from selected list if already selected
    }
    console.log('Selected Analyses:', this.selectedAnalyses); // Log the selected analyses
  }

  isSelected(analysisId: number): boolean {
    return this.selectedAnalyses.some((a) => a.id === analysisId);
  }

  fetchLabs(): void {
    const typeId = 1; // Assuming typeId for lab booking is 1
    this.service.getLabsByTypeId(typeId).subscribe(
      (response) => {
        if (response && response.Success && Array.isArray(response.Data)) {
          this.labs = response.Data; // Extract the Data array
          console.log('Labs Data:', this.labs); // Log the fetched labs
        } else {
          console.error('Invalid API response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching labs:', error);
      }
    );
  }

  onBookNow(lab: any): void {
    console.log('Lab clicked:', lab); // Log the lab object
    if (this.selectedAnalyses.length === 0) {
      this.showValidationMessage = true; // Show validation message
      console.log('Please select at least one analysis.');
    } else {
      this.showValidationMessage = false; // Hide validation message
      this.selectedLabId = lab.Id; // Store the selected lab ID
      console.log('Selected Lab ID:', this.selectedLabId); // Log the selected lab ID
      this.labBranches = []; // Reset the lab branches array
    }
  }

  onSearch(): void {
    if (!this.selectedLabId) {
      console.error('No lab selected.'); // Log an error if no lab is selected
      return;
    }
    if (this.selectedAnalyses.length === 0) {
      this.showValidationMessage = true; // Show validation message
      console.log('Please select at least one analysis.');
    } else {
      this.showValidationMessage = false; // Hide validation message
      const serviceIds = this.selectedAnalyses.map((a) => a.id); // Extract analysis IDs
      console.log('Request Body:', {
        LabId: this.selectedLabId,
        ServiceIds: serviceIds,
        TypeId: 1
      }); // Log the request body
      this.service.getLabBranches(this.selectedLabId, serviceIds, 1).subscribe(
        (response) => {
          if (response && response.Success && Array.isArray(response.Data)) {
            this.labBranches = response.Data; // Store the lab branches
            console.log('Lab Branches:', this.labBranches);
          } else {
            console.error('Invalid API response format:', response);
          }
        },
        (error) => {
          console.error('Error fetching lab branches:', error);
        }
      );
    }
  }

  // Get Image URL
  getImageUrl(imagePath: string): string {
    return `https://salamtechapi.azurewebsites.net${imagePath}`;
  }

  getLabName(labId: number): string {
    const lab = this.labs.find((l) => l.Id === labId);
    return lab ? lab.Name : 'Unknown Lab';
  }
}