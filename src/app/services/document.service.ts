import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HostListener, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private transloco: TranslocoService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getDocument(): Document {
    return this.document;
  }

  setDocumentLanguage(lang: string): void {
    this.transloco.setActiveLang(lang);
    if (this.isBrowser) {
      const html = this.document.getElementsByTagName('html')[0];
      if (html) {
        html.setAttribute('dir', lang);
      }
    }
  }

  getHostname(): string {
    if (this.isBrowser) {
      return `${this.document.location.protocol}//${this.document.location.host}`;
    }
    return '';
  }

  getDocumentLanguage(): string {
    if (!this.isBrowser) return 'en';
    return this.document.location.pathname.split('/')[1] || 'en';
  }

  getWindow(): any {
    return this.isBrowser ? window : null;
  }
}
