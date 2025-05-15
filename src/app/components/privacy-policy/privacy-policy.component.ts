import { Component } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  constructor(
    private metadataService : MetadataService
  ) { }
  ngOnInit(): void { 
    this.metadataService.updateMetadata('privacy-policy');
  }

}
