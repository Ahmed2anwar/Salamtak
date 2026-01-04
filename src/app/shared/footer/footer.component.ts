import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import Swal from 'sweetalert2';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    RoutesPipe
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'] // fixed typo
})
export class FooterComponent {
  isCollapsed = false;
  lang: string;
  private isBrowser: boolean;

  constructor(
    public translocoService: TranslocoService,
    private routesPipe: RoutesPipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.lang = this.translocoService.getActiveLang();
  }

  private openPage(arPath: string, enPath: string) {
    if (!this.isBrowser) return;

    const lang = localStorage.getItem('lang') || 'en';
    this.translocoService.setActiveLang(lang);

    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.getElementsByTagName('html')[0].setAttribute('dir', dir);

    const url = lang === 'ar' ? arPath : enPath;
    window.open(url);
  }

  goto() {
    this.openPage('/patient/termsOfAr', '/patient/termsOf');
  }

  gotoPrivacy() {
    this.openPage('/patient/privacyPolicyAr', '/patient/privacyPolicy');
  }

  gotoDoctorPrivacy() {
    this.openPage('/patient/doctorPrivacyAr', '/patient/doctorPrivacy');
  }

  gotoDoctorWebsite() {
    if (!this.isBrowser) return;
    window.open('https://doctor.salamtakgroup.com');
  }

  gotoDoctorWebsiteSoon() {
    Swal.fire({
      title: this.translocoService.translate('swal.Soon.title'),
      icon: 'question',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translocoService.translate('swal.Soon.ConfirmButtonText')
    });
  }

  collapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
