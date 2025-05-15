import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-angel',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    AccordionModule,
    FormsModule,
  ],
  templateUrl: './angel.component.html',
  styleUrl: './angel.component.scss'
})
export class AngelComponent {
  public blogs: any[] = []
  storageUrl = environment.storageUrl;
  lang = this.translocoService.getActiveLang()

  blog = [
    {



      icon: 'assets/icons/SalamtakCapN.png',
      title: 'Salamtak Cap',
      hex : '#fff',
      url:'/patient/SalamCap/4'

      // url:'/patient/SalamCap/1'


    },
    {
      icon: 'assets/icons/Salamtak Care NN.png',
      title: 'articals',
      hex : '#fff',
      url:'/patient/care/3'


    },
    // Pharmacies
    {


      icon: 'assets/icons/TrueorFN.png',
      title: 'True Or False',
      hex : '#fff',
      url:'/patient/true/1'



    },
    // Laboratories
    {
      icon: 'assets/icons/scoopN.png',
      title: 'scoop',
      hex : '#fff',
      url:'/patient/scope/2'



    },
    // Radiology Center
    {
      icon: 'assets/icons/Salamtak promotions N.png',
      title: 'Whats ',
      hex : '#fff',
      url:'/patient/pro/5'


    }

  ]

  constructor(
    private spinner: NgxSpinnerService,
    private patientService: AppService,
    private router:Router,
    private translocoService: TranslocoService,
    private metadataService: MetadataService,
    private routesPipe: RoutesPipe
  ) {}
  ngOnInit(): void {
    this.metadataService.updateMetadata('angel');

    this.getBlogs()
  }
  getBlogs() {
    this.spinner.show()
    this.patientService.getBlogs().subscribe(res => {
      this.blogs = res['Data']
      this.spinner.hide()
    })
  }
  goto(){
    // this.router.navigate([`/${this.lang}/patient/emergency`])
    this.router.navigate([this.routesPipe.transform('emergency')])
  }

  openAllQuestions(){
    //this.router.navigate(['/patient/questions'])
    this.router.navigate([this.routesPipe.transform('questionList')])
  }
}
