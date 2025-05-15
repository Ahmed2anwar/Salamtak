import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-scope',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './scope.component.html',
  styleUrl: './scope.component.scss'
})
export class ScopeComponent {
  id:any
  expandedIndex: number | null = null;
  btnText="Show More";
  public blogs: any[] = []
  storageUrl = environment.storageUrl;
  constructor(
    private spinner: NgxSpinnerService,
    private patientService: AppService,
    private route: ActivatedRoute,
    private metadataService : MetadataService


  ) {}

  ngOnInit(): void {
    this.metadataService.updateMetadata('scope');

    this.id = parseInt(this.route.snapshot.params['id']);
    this.getBlogs();

  }

  getBlogs() {

    this.spinner.show()
    this.patientService.getBlogss(2).subscribe(res => {
      this.blogs = res['Data']
      this.spinner.hide()
    })
  }

  showAllDesc(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

}
