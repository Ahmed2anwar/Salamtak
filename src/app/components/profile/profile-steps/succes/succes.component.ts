import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { languages } from '../../../../languages';
import { AuthenticationService } from '../../../../services/authentication.service';
import { CommonModule } from '@angular/common';
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
  constructor(
    private authentication: AuthenticationService,
    private _bottomSheet: MatBottomSheet,
    private translocoService: TranslocoService,
    private StorageService: LocalStorageService
  ) {
    this.authentication.currentUser.subscribe((currentUserSubject) => {
      this.user = currentUserSubject;
    });
  }

  ngOnInit(): void {
    const form: any = sessionStorage.getItem('sign-up-first-step');
    var date = JSON.parse(form);

    const lang = this.translocoService.getActiveLang();

    if (lang) {
      if (lang === 'ar') {
        this.IsEnglish = false;
        this.IsArabic = true;
        this.username = date.FullNameAr;

        // window.open('/termsAr')
      } else {
        this.IsEnglish = true;
        this.IsArabic = false;
        this.username = date.FullNameEn;
      }
      let Selected_lang = this.languages.find((t: any) => t.code === lang);

      this.selectedLanguage = Selected_lang;
      this.translocoService.setActiveLang(Selected_lang.code);
      this.translocoService.setActiveLang(Selected_lang.code);
      this.StorageService.setItem('lang', Selected_lang.code);
      document
        .getElementsByTagName('html')[0]
        .setAttribute('dir', Selected_lang.direction);
      this.flag = Selected_lang.flag;
    }

    // this.image=this.user.extra.Image
  }
  setLanguage(lang: any) {
    this.selectedLanguage = lang;
    this.translocoService.setActiveLang(lang.code);
    // localStorage.setItem('lang', lang.code);
    this.StorageService.setItem('lang', lang.code);
    document
      .getElementsByTagName('html')[0]
      .setAttribute('dir', lang.direction);

    window.location.reload();
  }
}
