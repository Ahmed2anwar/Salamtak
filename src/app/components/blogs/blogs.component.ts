import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { COMPONENT_KEYWORDS } from '../../component-keywords';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    RoutesPipe
  ],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
  public blogs: any[] = []
  storageUrl = environment.storageUrl;
  titleKey : any;
  descriptionKey : any;
  lang = this.translocoService.getActiveLang()
  blog = [
    {



      id:4,
      icon: 'assets/icons/SalamtakCapN.png',
      title: 'SalamtakCapsola',
      hex : '#fff',
      // url:`/${this.lang}/SalamtakCapsola`
      url: this.route.transform('SalamtakCapsola')
    },
    {
      icon: 'assets/icons/Salamtak Care NN.png',
      title: 'SalamtakCare',
      hex : '#fff',
      // url:'/SalamtakCare'
      // url:`/${this.lang}/SalamtakCare`
      url: this.route.transform('SalamtakCare')


    },
    // Pharmacies
    {
      icon: 'assets/icons/TrueorFN.png',
      title: 'SalamtakTrueOrFalse',
      hex : '#fff',
      // url:'/SalamtakTrueOrFalse'
      // url:`/${this.lang}/SalamtakTrueOrFalse`
      url: this.route.transform('SalamtakTrueOrFalse')



    },
    // Laboratories
    {
      icon: 'assets/icons/scoopN.png',
      title: 'SalamtakScoop',
      hex : '#fff',
      // url:'/SalamtakScoop'
      // url:`/${this.lang}/SalamtakScoop`
      url: this.route.transform('SalamtakScoop')
    },
    // Radiology Center
    {
      icon: 'assets/icons/Salamtak promotions N.png',
      title: 'SalamtakPromotions ',
      hex : '#fff',
      // url:'/SalamtakPromotions'
      // url:`/${this.lang}/SalamtakPromotions`
      url: this.route.transform('SalamtakPromotions')


    },
    {
      icon: 'assets/icons/NSize/Angle.png',
      title: 'SalamtakAngel',
       hex : '#fff',
      // url : '/SalamtakAngel',
      // url : `/${this.lang}/SalamtakAngel`
      url : this.route.transform('emergency')
    }

  ]

  constructor(
    private spinner: NgxSpinnerService,
    private patientService: AppService,
    private translocoService: TranslocoService,
    private service : AppService,
    private metadataService: MetadataService,
    private route: RoutesPipe

  ) {}
  ngOnInit(): void {
    this.metadataService.updateMetadata('blogs');
    this.getBlogs()
  }
  getBlogs() {
    this.spinner.show()
    this.patientService.getBlogs().subscribe(res => {
      this.blogs = res['Data']
      this.spinner.hide()
    })
  }

}
