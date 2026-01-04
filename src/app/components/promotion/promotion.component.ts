import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss'
})
export class PromotionComponent {
  id:any;
  public blogs: any[] = []
  showmore=false;
  btnText="Show More";
  storageUrl = environment.storageUrl;
  constructor(
    private spinner: NgxSpinnerService,
    private patientService: AppService,
    private route: ActivatedRoute,
    private metadataService : MetadataService


  ) {}

  ngOnInit(): void {
    this.metadataService.updateMetadata('promotion');

    this.id = parseInt(this.route.snapshot.params['id']);
    this.getBlogs();

  }

  getBlogs() {
    
    this.spinner.show()
    this.patientService.getBlogss(5).subscribe(res => {
      this.blogs = res['Data']
      this.spinner.hide()
    })
  }
  showAllDesc(i:any)
  {
    if(this.showmore)
    this.btnText="Show More";
    else
    this.btnText="Show Less";
    this.showmore=!this.showmore;
  }
}
