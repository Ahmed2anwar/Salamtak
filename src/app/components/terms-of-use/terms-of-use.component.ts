import { Component } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.scss'
})
export class TermsOfUseComponent {
  constructor(
    private metadataService : MetadataService
  ) { }
  ngOnInit(): void { 
    this.metadataService.updateMetadata('terms-of-use');
  }
}
