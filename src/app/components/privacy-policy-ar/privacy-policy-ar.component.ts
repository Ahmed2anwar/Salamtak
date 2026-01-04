import { Component } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-privacy-policy-ar',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy-ar.component.html',
  styleUrl: './privacy-policy-ar.component.scss'
})
export class PrivacyPolicyArComponent {
  constructor(
    private metadataService : MetadataService
  ) { }
  ngOnInit(): void { 
    this.metadataService.updateMetadata('privacy-policy-ar');
  }
}
