import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit, Renderer2 } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DocumentService } from './services/document.service';
import { routes } from './app.routes';
import { AppService } from './services/app.service';
import { SitemapService } from './services/sitemap-service.service';
import { filter } from 'rxjs';
import { LocalStorageService } from './services/local-storage.service';
import { routesKeys } from './routes.lang';
import { MetadataService } from './services/metadata.service';
import { LangServService } from './services/lang-serv.service';
import { AnalyticsServiceService } from './services/analytics-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSpinnerModule,
    TranslocoModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Salamtak';
  routes: any = routes;
  doctors: any;
  lang: any
  links: string[] = [];

  isBrowser: boolean = false;

  constructor(
    private transloco: TranslocoService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ds: DocumentService,
    private service: AppService,
    private sitemapService: SitemapService,
    private storage: LocalStorageService,
    private metadataService: MetadataService,
    private languageService: LangServService,
    private analyticsService: AnalyticsServiceService,
    private renderer: Renderer2

  ) {
    this.isBrowser = isPlatformBrowser(platformId)
    if (this.isBrowser) {
      this.storage.removeItem('filterTitle');
    }
    if (this.isBrowser) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.setLangFromUrl(event.urlAfterRedirects);
          this.handleDoctorSEO(event.urlAfterRedirects);
        }
      });
    }
    if (this.isBrowser) {
      this.lang = this.storage.getItem('lang');
      this.ds.setDocumentLanguage(this.lang);
    }

    // this.isBrowser = isPlatformBrowser(platformId);


    // let defaultLang = 'en';

    // if (!this.isBrowser) {

    //   this.lang = defaultLang;
    //   this.transloco.setActiveLang(defaultLang);
    // } else {

    //   const storedLang = this.storage.getItem('lang');
    //   this.lang = storedLang || defaultLang;
    //   this.transloco.setActiveLang(this.lang);
    // }

  }
  ngOnInit(): void {
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://salamtakgroup.com/#organization",
          "name": "SalamTak Group",
          "url": "https://salamtakgroup.com",
          "logo": "https://salamtakgroup.com/logo.png",
          "description": "SalamTak Group is an online medical booking platform that connects patients with trusted healthcare providers and medical services.",
          "sameAs": [
            "https://www.facebook.com/share/16iPLtNZGE/?mibextid=wwXIfr",
            "https://www.instagram.com/salamtakgroup",
            "https://www.linkedin.com/company/salamtak/"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "url": "https://salamtakgroup.com/contact"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://salamtakgroup.com/#website",
          "url": "https://salamtakgroup.com",
          "name": "SalamTak Group",
          "description": "Online medical booking platform connecting patients with trusted healthcare providers.",
          "publisher": {
            "@id": "https://salamtakgroup.com/#organization"
          }
        }
      ]

    };
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.renderer.appendChild(this.document.head, script);


    if (!this.isBrowser) return;
    const lang = this.storage.getItem('lang') || 'en';
    if (lang === 'ar') {
      const link = this.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'assets/styles/arabic.css';
      this.document.head.appendChild(link);
    }
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateCanonicalUrl());
  }
  private setLangFromUrl(url: string) {
    if (!this.isBrowser) return
    const lang = url.split('/')[1];
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  private handleDoctorSEO(url: string) {
    if (!this.isBrowser) return;

    const parts = url.split('/');
    const lang = parts[1];
    const page = decodeURIComponent(parts[2]);

    if (page !== 'doctor' && page !== 'الطبيب') return;

    let docName = parts[4]?.split('?')[0]?.replace(/-/g, ' ') || '';
    let specialist = parts[4]?.split('?')[1]?.split('=')[2]?.replace(/-/g, ' ') || '';

    const dr = lang === 'ar' ? 'دكتور ' : 'Dr ';
    this.document.title = `${dr}${docName} - ${specialist}`;
    this.metadataService.updateMetaDescription(dr + specialist);
  }

  updateCanonicalUrl() {
    if (!this.isBrowser) return;

    const canonicalUrl = this.document.location.origin + this.router.url.split('?')[0];
    let link = this.document.querySelector("link[rel='canonical']");

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', canonicalUrl);
  }
}
