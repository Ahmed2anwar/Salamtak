import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TranslocoService } from '@jsverse/transloco';
import { languages } from '../../languages';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { Router } from '@angular/router';
import { routesKeys } from '../../routes.lang';

@Component({
  selector: 'app-change-language',
  standalone: true,
  imports: [
    MatListModule,
    CommonModule,
    RoutesPipe
  ],
  templateUrl: './change-language.component.html',
  styleUrl: './change-language.component.scss'
})
export class ChangeLanguageComponent {
  languages = languages
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ChangeLanguageComponent>,
    private translocoService: TranslocoService,
    private storageService:LocalStorageService,
    private routesPipe:RoutesPipe,
    private router:Router
  ) {}

  // openLink(event: MouseEvent): void {
  //   this._bottomSheetRef.dismiss();
  //   // this.setLanguage('ar');
  //   event.preventDefault();
  // }
  // setLanguage(lang: any) {
  //   this._bottomSheetRef.dismiss();
  //   this.translocoService.setActiveLang(lang.code);
  //   localStorage.setItem('lang', lang.code);
  //   document.getElementsByTagName('html')[0].setAttribute('dir', lang.direction);
  // }
  setLanguage(code: any) {
    //console.log(code)
    code = code.code
    this.storageService.setItem('lang', code);

    var doctorsPage =  this.routesPipe.transform('find-a-doctor');
    var pageName = '/' + this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2];
    var pageKey :any = this.storageService.getItem('PAGE_CURRENT_KEY');
    // this.spinner.show();
    if(decodeURIComponent(pageName) == doctorsPage){
      // debugger

      let newUrl :any = this.storageService.getItem('alternativeUrl');
      //console.log(newUrl)
      newUrl = decodeURIComponent(newUrl);
      //console.log(newUrl)
      this.storageService.setItem('alternativeUrl', this.storageService.getItem('currentUrl'));
      this.storageService.setItem('currentUrl', (newUrl));
      this.router.navigate([(newUrl)]).then(() => {
        // Reload after URL change
        window.location.reload();
      });
      return
    }

    console.clear()
    //console.log(pageName)
    //console.log(pageKey)

    // export const routesKeys: any = {
    //   "home": {
    //     "ar": "ar/الرئيسية",
    //     "en": "en/home"
    //   },

    const routes = routesKeys;
    //console.log(routesKeys)

    function findKeyByValue(value: string) {
      value = decodeURIComponent(value);
      if (!value) return null;

      const modifiedValue = value.startsWith("/") ? value.substring(1) : value;

      for (const key in routesKeys) {
          if (routesKeys[key].ar === modifiedValue || routesKeys[key].en === modifiedValue) {
              return routesKeys[key];
          }
      }
      return null;
  }

    //console.log(findKeyByValue((pageKey)))
    //console.log(findKeyByValue((pageName)))


    // routes[pageKey][code] = pageName;


    this.router.navigate([findKeyByValue(pageName)[code]]).then(() => {
      window.location.reload();
    });;

    // console.log(this.routesPipe.transform(pageKey))
    // console.log(searchRouteByKey(pageKey))

    // this.StorageService.clear();
    // this.translocoService.setActiveLang(code);
    // this.doc.setDocumentLanguage(code);
    // console.log(this.router.url ,'gggggggg')
    // console.log(this.routesPipe?.transform(pageKey));
    // this.spinner
    // this.router.navigate([this.routesPipe?.transform(pageKey)]).then(() => {
    //   // Reload after URL change
    //   console.log(this.routesPipe?.transform(pageKey));

    //   window.location.reload();
    // });;






  }
  getLanguage() {
    return this.translocoService.getActiveLang();
  }
}
