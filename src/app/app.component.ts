import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DocumentService } from './services/document.service';
import { routes } from './app.routes';
import { AppService } from './services/app.service';
import { SitemapService } from './services/sitemap-service.service';
import { filter } from 'rxjs';
import { LocalStorageService } from './services/local-storage.service';
import { routesKeys } from './routes.lang';
import { MetadataService } from './services/metadata.service';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSpinnerModule,
    TranslocoModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Salamtak';
  routes :any = routes
  doctors : any
  lang : any;
  links: string[] = [];

  constructor(

    private transloco: TranslocoService,
    private router: Router,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ds : DocumentService,
    private service: AppService,
    private sitemapService: SitemapService,
    private storage : LocalStorageService,
    private metadataService : MetadataService,
    @Inject(DOCUMENT) private document: Document,
    // private toastr: ToastrService
  ) {
    this.storage.removeItem('filterTitle')

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setLangFromUrl(event.urlAfterRedirects);

        // console.log(event.urlAfterRedirects)

        // /en/doctor/14/Atef-Mohamed-Ezzat?ClinicId=4005

        var url = event.urlAfterRedirects,
            lang = url.split('/')[1],
            pageName = decodeURIComponent(url.split('/')[2]);
            // console.log(url)
            //console.log(pageName)
        if(pageName == 'doctor' || pageName == 'الطبيب'){
          var docName = url.split('/')[4];
          // remove ClinicId from url
          docName = docName.split('?')[0];
          // replace - with space
          docName = docName.replace(/-/g, ' ');
          // find Specialist
          var lastText = url.split('/')[4];
          var specialist = lastText.split('?')[1];
          specialist = specialist?.split('=')[2];
          specialist = specialist.replace(/-/g, ' ');
          var dr = (lang == 'ar') ? 'دكتور ' : 'Dr ';
          this.document.title = dr + '' + decodeURIComponent(docName) + ' - ' + decodeURIComponent(specialist);
          var metaDescriptionText = dr + decodeURIComponent(specialist)
          this.metadataService.updateMetaDescription(metaDescriptionText);
        }
      }
    });


    var lang = (this.storage.getItem('lang') as string);
    this.lang = lang;
    this.ds.setDocumentLanguage(lang);
  }

  private setLangFromUrl(url: string) {
    const lang = url.split('/')[1];
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  ngOnInit(): void {

  }

  getAllDoctors() {
    this.service.getAllDoctors().subscribe((res: any) => {
      this.doctors = res.Result.Data
    })
  }
  fetchSitemapLinks(): void {
    this.sitemapService.generateSitemapLinks().subscribe((links: string[]) => {
      this.links = links;
    });
  }
  private listenToRouteChanges() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.saveCurrentRoute(event.urlAfterRedirects);
    });
  }

  // دالة لحفظ المسار الحالي
  private saveCurrentRoute(url: string) {
    url = decodeURIComponent(url)
    let lang = url.split('/')[1],
        page = url.split('/')[2];
    let matchedPageKey = Object.keys(routesKeys).find(key =>
          routesKeys[key][lang] === `${lang}/${page}`
    );
    this.storage.setItem('PAGE_CURRENT_KEY', matchedPageKey);
  }

}
