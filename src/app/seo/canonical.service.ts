// src/app/seo/canonical.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setCanonicalURL(url?: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const head = this.doc.head;
      let link: HTMLLinkElement = this.doc.querySelector("link[rel='canonical']") || this.doc.createElement('link');

      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url || this.doc.URL);

      if (!link.parentNode) {
        head.appendChild(link);
      }
    }
  }
}
