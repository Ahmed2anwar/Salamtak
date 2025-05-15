import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import {MatStepperModule} from '@angular/material/stepper';
import { filter } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    RoutesPipe,
    MatStepperModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
  @ViewChild('stepper') stepper: any;
  lang = this.translocoService.getActiveLang();
  pageName:any;
  public user:any;
  // this.StorageService.setItem('new-user',true)

  constructor(private service : AuthenticationService,
    private translocoService: TranslocoService,
    private metadataService : MetadataService,
    private router : Router,
    private authentication :AuthenticationService
  ) {
    this.authentication.currentUser.subscribe(currentUserSubject => this.user = currentUserSubject)
    this.setPageName()
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.setPageName()
    })

  }
  ngOnInit(): void {
    this.metadataService.updateMetadata('profile');
  }
  afterViewInit() {

  }
  setPageName(){
    let url = this.router.url;
    let pages = url.split('/').filter(segment => segment); // تقطيع الرابط وإزالة الفواصل الفارغة
    let currentPage = pages[pages.length - 1]; // الحصول على اسم الصفحة الحالية
    // console.clear()
    currentPage = decodeURIComponent(currentPage);
    // remove all text after the last '?'
    if (currentPage.includes('?')) {
      currentPage = currentPage.substring(0, currentPage.indexOf('?'));
    }

    // console.log(currentPage)
    if(currentPage == null || currentPage == undefined) {
      currentPage = 'personal-info'
    }else{
      currentPage = currentPage
    }
    this.pageName = currentPage
    // this.pageName = decodeURIComponent(currentPage)

  }
}
