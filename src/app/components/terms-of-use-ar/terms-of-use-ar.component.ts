import { Component } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-terms-of-use-ar',
  standalone: true,
  imports: [],
  templateUrl: './terms-of-use-ar.component.html',
  styleUrl: './terms-of-use-ar.component.scss'
})
export class TermsOfUseArComponent {
  constructor(
    private metadataService : MetadataService
  ) { }
  ngOnInit(): void { 
    this.metadataService.updateMetadata('terms-of-use-ar');
  }
}
