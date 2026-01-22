import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { languages } from '../../languages';
import { AuthenticationService } from '../../services/authentication.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { routesKeys } from '../../routes.lang';
import { DocumentService } from '../../services/document.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeLanguageComponent } from '../change-language/change-language.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../../components/@authentication/login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppService } from '../../services/app.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatBottomSheetModule,
    MatMenuModule,
    TranslocoModule,
    RouterModule,
    CommonModule,
    RoutesPipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  languages = languages;
  // selectedLanguage = this.languages[0];
  selectedLanguage = this.languages.find(
    (lang: any) => lang.code === this.translocoService.getActiveLang()
  );
  isCollapsed: any = false;
  public IsEnglish = false;
  public IsArabic = true;
  flag: any;
  phone = '17143';
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  collapse() {
    this.isCollapsed = false;
  }
  reloded = false;
  lang = this.translocoService.getActiveLang();
  doctorResponses: any[] = [];
  userNoti: any[] = [];
  unreadCount: number = 0;
  isDropdownOpen = false;
  private scrollListener: any;
  isLoggedIn = false;
  public patient: any;
  public forms: any = {
    FullNameEn: [''],
    FullNameAr: [''],
    Phone: [''],
    Email: [''],
    Password: [''],
    ConfirmPassword: [''],
    image: [''],
    Terms: [''],
  };
  public username: any;
  public user: any = null;
  constructor(
    public dialog: MatDialog,
    private authentication: AuthenticationService,
    private _bottomSheet: MatBottomSheet,
    private service: AppService,

    public translocoService: TranslocoService,
    private router: Router,
    private StorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private transPipe: RoutesPipe,
    private doc: DocumentService,
    private routesPipe: RoutesPipe,
    private storageService: LocalStorageService,
    private spinner: NgxSpinnerService
  ) {
    this.authentication.currentUser.subscribe((currentUserSubject) => {
      this.user = currentUserSubject;
    });
  }
  gotoDoctorWebsite() {
    window.open('https://doctor.salamtakgroup.com')
  }
  login() {
    this.dialog.open(LoginComponent, {
      width: '400px',
      height: 'auto',
      data: {},
    });
  }
  ngOnInit(): void {
    var url = this.router.url;
    var currentLang = url.split('/')[1];
    this.lang = currentLang;
    this.selectedLanguage = this.languages.find(
      (lang: any) => lang.code === currentLang
    );
    this.StorageService.setItem('lang', 'en');
    const form: any = this.StorageService.getItem('sign-up-first-step');
    var date = JSON.parse(form);
    this.authentication.isLoggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        this.user = this.authentication.getCurrentUser();
        this.getUserNotifi();
      } else {
        this.user = null;
      }
    });

  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;

  }
  // getUnreadDoctorResponses() {
  //   this.authentication
  //     .getUnreadDoctorResponsesByUserIdAsync()
  //     .subscribe((response: any) => {
  //       if (response.Success) {
  //         this.doctorResponses = response.Data.Responses;
  //         this.unreadCount = response.Data.UnreadCount;
  //       }
  //     });
  // }
  getUserNotifi() {
    this.service.getUserNotifi().subscribe((res: any) => {
      this.userNoti = res.Data;
      
    })
  }

  // markAllAsRead() {
  //   this.authentication.markAllDoctorResponsesAsReadAsync().subscribe(() => {
  //     this.doctorResponses.forEach((response) => {
  //       response.IsNotified = false;
  //     });
  //     this.unreadCount = 0;
  //   });
  // }
  signOut() {
    this.authentication.logout();
  }
  changeLanguage(): void {
    this._bottomSheet.open(ChangeLanguageComponent);
  }
  setLanguage(code: any) {
    this.storageService.setItem('lang', code);
    var doctorsPage = this.routesPipe.transform('find-a-doctor');
    var pageName =
      '/' + this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2];
    var pageKey: any = this.storageService.getItem('PAGE_CURRENT_KEY');
    if (this.storageService.getItem('PAGE_CURRENT_KEY') == 'find-a-doctor') {
      let currentUrl: any = this.storageService.getItem('currentUrl'),
        alternativeUrl: any = this.storageService.getItem('alternativeUrl');
      if (currentUrl.includes('doctors')) {
        currentUrl = currentUrl.replace('كل-التخصصات', 'all-specialities');
      }
      if (currentUrl.includes('الاطباء')) {
        currentUrl = currentUrl.replace('all-specialities', 'كل-التخصصات');
      }
      if (alternativeUrl.includes('doctors')) {
        alternativeUrl = alternativeUrl.replace(
          'كل-التخصصات',
          'all-specialities'
        );
      }
      if (alternativeUrl.includes('الاطباء')) {
        alternativeUrl = alternativeUrl.replace(
          'all-specialities',
          'كل-التخصصات'
        );
      }
      this.storageService.setItem(
        'alternativeUrl',
        decodeURIComponent(currentUrl)
      );
      this.storageService.setItem(
        'currentUrl',
        decodeURIComponent(alternativeUrl)
      );
      this.router.navigate([alternativeUrl]).then(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.location.reload();
        }
      });
      return;
    }
    if (
      this.storageService.getItem('PAGE_CURRENT_KEY') ==
      'find-a-doctor-by-sub-specialty'
    ) {
      let currentUrl: any = this.storageService.getItem('currentUrl'),
        alternativeUrl: any = this.storageService.getItem('alternativeUrl');
      this.storageService.setItem(
        'alternativeUrl',
        decodeURIComponent(currentUrl)
      );
      this.storageService.setItem(
        'currentUrl',
        decodeURIComponent(alternativeUrl)
      );
      this.router.navigate([alternativeUrl]).then(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.location.reload();
        }
      });
      return;
    }
    const routes = routesKeys;
    function findKeyByValue(value: string) {
      value = decodeURIComponent(value);
      value = value.split('?')[0];
      if (!value) return null;
      const modifiedValue = value.startsWith('/') ? value.substring(1) : value;
      for (const key in routesKeys) {
        if (
          routesKeys[key].ar === modifiedValue ||
          routesKeys[key].en === modifiedValue
        ) {
          return routesKeys[key];
        }
      }
      return null;
    }
    let queryParams: any = {};
    if (isPlatformBrowser(this.platformId)) {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.forEach((value, key) => {
        queryParams[key] = value;
      });
    }
    this.router
      .navigate([findKeyByValue(pageName)[code]], { queryParams })
      .then(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.location.reload();
        }
      });
  }
  getPatient() {

    this.authentication.GetPatient().subscribe((patient: any) => {
      this.patient = patient;
      const lang = this.translocoService.getActiveLang();

      if (lang) {
        if (lang === 'ar') {
          this.IsEnglish = false;
          this.IsArabic = true;
          this.username = this.patient.Data.FullNameAr;

        } else {
          this.IsEnglish = true;
          this.IsArabic = false;
          this.username = this.patient.Data.FullName;
        }
        let Selected_lang = this.languages.find((t: any) => t.code === lang);
        this.selectedLanguage = Selected_lang;
        this.flag = Selected_lang.flag;
      }
    });

  }
  getLanguageUrl(code: string): string {
    const currentPath = this.router.url.replace(/^\/(en|ar|fr)/, '');
    return `/${code}${currentPath}`;
  }

}
