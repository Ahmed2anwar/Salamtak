import { Component } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-doctors-privacy-policy-ar',
  standalone: true,
  imports: [],
  templateUrl: './doctors-privacy-policy-ar.component.html',
  styleUrl: './doctors-privacy-policy-ar.component.scss'
})
export class DoctorsPrivacyPolicyArComponent {
  constructor(
    private metadataService : MetadataService
  ) { }
  ngOnInit(): void { 
    this.metadataService.updateMetadata('doctors-privacy-policy-ar');
  }
}
