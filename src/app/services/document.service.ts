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
    private transloco : TranslocoService,
    private router: Router
    
) { 
  this.isBrowser = isPlatformBrowser(this.platformId);

}


  getDocument(): Document {
    return this.document;
  }
  setDocumentLanguage(lang: string): void {
    this.transloco.setActiveLang(lang);

    if(this.document){
      if (typeof window !== "undefined") {
        var url = window.location.href;
        lang = url.split('/')[3];
        this.document.getElementsByTagName('html')[0].setAttribute('dir', lang);
        
      }

        
      //   // this.document.getElementsByTagName('html')[0].setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      //   // this.href = this.router.url;

      //   // this.document.getElementsByTagName('html')[0].setAttribute('lang', lang === 'ar' ?  'ar' : 'en');
      // }
      // this.document.getElementsByTagName('html')[0].setAttribute('diraaaa', this.router.getCurrentNavigation);

     
      
      // this.document.getElementsByTagName('html')[0].setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      // this.document.getElementsByTagName('html')[0].setAttribute('lang', lang === 'ar' ?  'ar' : 'en');


      

      // localStorage.setItem('lang', lang || 'en');
// 
      // this.document.getElementsByTagName('html')[0].setAttribute('diraaaaaa', lang === 'ar' ? 'rtl' : 'ltr');
    }
  }
  getHostname(): string
  {
    if(this.document){
      var url = this.document.location.protocol +'//'+ this.document.location.hostname 
    } else {
      var url = ''
    }
    // get full url
    return url

  }
  getDocumentLanguage(): any{
    let url =this.document.location.pathname // /ar/%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%A8/14/%D8%B9%D8%A7%D8%B7%D9%81%20%D9%85%D8%AD%D9%85%D8%AF%20%D8%B9%D8%B2%D8%AA
    url = url.split('/')[1]
    return url; 
  }
  // window scr
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(e:any) {
  // }
  getWindow(): any {
    if (this.isBrowser) {
      return window;
    } else {
      return null; // يمكن إعادتك شيء افتراضي هنا
    }
  }
}
