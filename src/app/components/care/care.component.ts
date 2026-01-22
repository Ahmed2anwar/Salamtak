import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-care',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,

    AccordionModule,
    FormsModule,
    RoutesPipe,
  ],
  templateUrl: './care.component.html',
  styleUrl: './care.component.scss',
})
export class CareComponent {
  id: any;
  data: any;
  public blogs: any[] = [];
  showmore = false;
  btnText = 'Show More';
  storageUrl = environment.storageUrl;
  expandedIndex: number | null = null;
  lang = this.translocoService.getActiveLang();

  constructor(
    private spinner: NgxSpinnerService,
    private patientService: AppService,
    private route: ActivatedRoute,
    private metadataService: MetadataService,
    private translocoService: TranslocoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.metadataService.updateMetadata('care');
    this.id = parseInt(this.route.snapshot.params['id']);
    this.getBlogs();
  }

  getBlogs() {
    // this.spinner.show()
    this.patientService.getBlogss(3).subscribe((res) => {
      this.blogs = res['Data'];
      this.spinner.hide();
    });
  }

  navigateToBlog(item: any) {
    this.router.navigate([this.lang, 'SalamtakCare', item.Title]);
  }

}
