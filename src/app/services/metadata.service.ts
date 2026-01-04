import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private metadataUrl = 'assets/metadata.json';
  private metadata: any;
  private text :any = '';
  constructor(
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
    private translocoService: TranslocoService,
    private router: Router
  ) {


  }
  loadMetadata(): Observable<any> {
    return this.http.get<any>(this.metadataUrl).pipe(
      tap(data => this.metadata = data)
    );
  }

  updateMetadata(component: string): void {
    if (this.metadata && this.metadata[component]) {
      const componentMetadata = this.metadata[component];
      const url = this.router.url;
      const lang :any = url.split('/')[1];

      var title = (componentMetadata[lang].title != "" ? componentMetadata[lang].title : `${component} | ${lang}`);
      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'description', content: componentMetadata[lang].description });
      this.metaService.updateTag({ name: 'keywords', content: componentMetadata[lang].keywords });
    }
  }

  updateTitle(text : any,page? :any): void {
      // text = this.translocoService.translate('app-name') + ' | ' + text
      // this.text = text
      try {
        text = text + this.metadata[page][this.translocoService.getActiveLang()].title
      } catch (error) {
        text = text
      }

      this.titleService.setTitle(text);
    }

  updateMetaDescription(text : any,page? :any): void {
      try {
        this.metaService.updateTag({ name: 'description', content:
          text + ' ' +  this.metadata[page][this.translocoService.getActiveLang()].description
         });
      } catch (error) {
        this.metaService.updateTag({ name: 'description', content: text })
      }
      // metadataUrl

    }
}
