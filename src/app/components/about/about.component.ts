import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { Observable } from 'rxjs';
import { DownloadAppComponent } from "../download-app/download-app.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    DownloadAppComponent
],
  templateUrl: './about.component.html',
  styleUrls : [

    './about.component.scss',
    '../blogs/blogs.component.scss',
  ]
})
export class AboutComponent {
  //Access Languages.
  lang = this.translocoService.getActiveLang()


  missoinServices:Observable<any>;
  visionServices:Observable<any>;
  salamtakServices:Observable<any>;
  constructor(private translocoService: TranslocoService,private metadataService: MetadataService,private route: RoutesPipe) {

    this.missoinServices = this.translocoService.selectTranslateObject('about-us.mission.mission-services');
    this.salamtakServices = this.translocoService.selectTranslateObject('about-us.services.salamtak-services');
    this.visionServices = this.translocoService.selectTranslateObject('about-us.vision.vision-services');
  }




  ngOnInit(): void {

    this.metadataService.updateMetadata('about');

  }
}
