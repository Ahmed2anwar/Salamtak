import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
declare global {
  interface Window {
    dataLayer: any[];
  }
}
@Injectable({
  providedIn: 'root'
})



export class AnalyticsServiceService {

   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Load GA script
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-MK28D1G3TF';
      script.async = true;
      document.head.appendChild(script);

      // Initialize GA
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      // gtag('js', new Date());
      // gtag('config', 'G-MK28D1G3TF');
    }
  }
}
