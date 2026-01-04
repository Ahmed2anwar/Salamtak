
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class LangServService {
  private lang: string = 'en';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const url = window.location.href;
      this.lang = url.split('/')[3] || 'en';
      localStorage.setItem('lang', this.lang);
    }
  }
  getLang(): string {
    return this.lang;
  }
}
