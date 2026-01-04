import { Inject, inject, PLATFORM_ID } from '@angular/core';
import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { languages } from '../../../../languages';
import { AuthenticationService } from '../../../../services/authentication.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { RoutesPipe } from '../../../../pipes/routes.pipe';

@Component({
  selector: 'app-succes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    MatMenuModule,
    FormsModule,
    CommonModule,
    RouterModule,
    RoutesPipe,
  ],
  templateUrl: './succes.component.html',
  styleUrl: './succes.component.scss',
})
export class SuccesComponent {
  languages = languages;

  selectedLanguage = this.languages[0];
  isCollapsed = false;
  public IsEnglish = false;
  public IsArabic = true;
  flag: any;
  username: any;
  // user :any= null
  public user: any;
  public isBrowser: boolean = isPlatformBrowser(this.platformId);

  constructor(
    private authentication: AuthenticationService,
    private _bottomSheet: MatBottomSheet,
    private translocoService: TranslocoService,
    private StorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.authentication.currentUser.subscribe((currentUserSubject) => {
      this.user = currentUserSubject;
    });
  }


  ngOnInit(): void {

    let date: any = null;

    if (this.isBrowser) {
      const form = sessionStorage.getItem('sign-up-first-step');
      if (form) {
        date = JSON.parse(form);
      }
    }

    const lang = this.translocoService.getActiveLang();

    if (!lang || !date) return;

    if (lang === 'ar') {
      this.IsEnglish = false;
      this.IsArabic = true;
      this.username = date.FullNameAr;
    } else {
      this.IsEnglish = true;
      this.IsArabic = false;
      this.username = date.FullNameEn;
    }

    const selectedLang = this.languages.find(
      (t: any) => t.code === lang
    );

    if (!selectedLang) return;

    this.selectedLanguage = selectedLang;
    this.translocoService.setActiveLang(selectedLang.code);

    if (this.isBrowser) {
      this.StorageService.setItem('lang', selectedLang.code);

      document
        .documentElement
        .setAttribute('dir', selectedLang.direction);
    }

    this.flag = selectedLang.flag;
  }

  setLanguage(lang: any) {
    this.selectedLanguage = lang;
    this.translocoService.setActiveLang(lang.code);
    this.StorageService.setItem('lang', lang.code);
    document
      .getElementsByTagName('html')[0]
      .setAttribute('dir', lang.direction);

    if (this.isBrowser) {
      window.location.reload();
    }
  }
}
