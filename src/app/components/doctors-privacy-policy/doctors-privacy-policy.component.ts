import { Component } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-doctors-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './doctors-privacy-policy.component.html',
  styleUrl: './doctors-privacy-policy.component.scss'
})
export class DoctorsPrivacyPolicyComponent {
  constructor(
    private metadataService : MetadataService
  ) { }
  ngOnInit(): void { 
    this.metadataService.updateMetadata('doctors-privacy-policy');
  }
}
