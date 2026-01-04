import { Specialty } from './../../../model';
import {
  Component,
  HostListener,
  inject,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs';
// import * as AOS from 'aos';
import { COMPONENT_KEYWORDS } from '../../component-keywords';
import { AppService } from '../../services/app.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { DownloadAppComponent } from '../download-app/download-app.component';
import { TableModule } from 'primeng/table';
import { ApiResponse, Doctor } from '../../../model';
import { log } from 'node:console';
import { AuthenticationService } from '../../services/authentication.service';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LoginComponent } from '../@authentication/login/login.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselModule,
    TranslocoModule,
    RouterModule,
    CommonModule,
    MatDialogModule,
    SearchFormComponent,
    RoutesPipe,
    DownloadAppComponent,
    TableModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public blogs: any[] = [];
  params: { [key: string]: any } = {};
  public offers: any[] = [];
  storageUrl = environment.storageUrl;
  titleKey: any;
  descriptionKey: any;
  services = [];
  public doctors: Doctor[];
  topSpecialties: Specialty[] = [];
  popularDoctors = [];
  activeSpecialtyId: any | null = null;
  salamtakCapId = 1;
  lang = this.translocoService.getActiveLang();
  blog = [
    {
      icon: 'assets/icons/scoopN.png',
      title: 'SalamtakScoop',
      hex: '#fff',
      url: 'SalamtakScoop',
    },
    {
      icon: 'assets/icons/Salamtak Care NN.png',
      title: 'SalamtakCare',
      hex: '#fff',
      url: 'SalamtakCare',
    },
    {
      icon: 'assets/icons/TrueorFN.png',
      title: 'SalamtakTrueOrFalse',
      hex: '#fff',
      url: 'SalamtakTrueOrFalse',
    },
    {
      icon: 'assets/icons/SalamtakCapN.png',
      title: 'SalamtakCapsola',
      hex: '#fff',
      url: 'SalamtakCapsola',
    },
    {
      icon: 'assets/icons/promotion.png',
      title: 'SalamtakPromotions ',
      hex: '#fff',
      url: 'SalamtakPromotions',
    },
  ];
  medicalServices = [


    // Laboratories
    {
      icon: 'assets/labor.png',
      title: 'Laboratories',
      translate: 'laboratories',
      hex: 'rgba(219, 139, 67, 1)',
      url: 'laboratories',
    },
    {
      icon: 'assets/phara.png',
      title: 'Pharmacies',
      translate: 'pharmacies',
      hex: 'rgba(16, 179, 174, 1)',
      url: 'pharmacies',
    },

    {
      icon: 'assets/icons/radio.png',
      title: 'Radiology Centers',
      translate: 'radiology-center',
      hex: 'rgba(22, 144, 180, 1)',
      url: 'radiology-center',
    },
    {
      icon: 'assets/hosp.png',
      title: 'Hospitals',
      translate: 'hospitals',
      hex: 'rgba(43, 41, 121, 1)',
      // url : '/hospitals'
      url: 'hospitals',
    },

    {
      icon: 'assets/icons/angelmmm 1.png',
      title: 'RadiologyCenter',
      translate: 'emergency',
      hex: 'rgba(197, 98, 81, 1)',
      url: 'SalamtakAngel',
    },
  ];
  specialties = [
    // {
    //   image : 'assets/fake-images-for-test/Skin.png',
    //   title : 'Skin',
    // },
    // {
    //   image : 'assets/fake-images-for-test/Teeth.png',
    //   title: 'Teeth',
    // },
    // {
    //   image : 'assets/fake-images-for-test/Child.png',
    //   title: 'Child',
    // },
    // // Therapist
    // {
    //   image : 'assets/fake-images-for-test/Therapist.png',
    //   title: 'Therapist',
    // }
  ];
  SpecialtyOption: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: true,
    margin: 40,
    stagePadding: 40,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
  };
  doctOption: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: false,
    margin: 20,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 2,
      },
    },
  };
  specialtiesOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<img src="assets/icons/Arrow-Left-2.svg">',
      '<img src="assets/icons/Arrow-Right-2.svg">',
    ],
    autoplay: true,
    margin: 20,
    autoplayTimeout: 6000,
    nav: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 4,
      },
      940: {
        items: 4,
      },
    },
  };
  testimonials = [
    {
      userImage: 'assets/fake-images-for-test/one.jpg',
      stars: 5,
      userName: 'تركيب التقويم المعدني',
      translate: 'tt',
      url: `/${this.lang}/offer`,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      userImage: 'assets/fake-images-for-test/two.jpg',
      stars: 5,
      userName: 'تنظيف البشرة',
      translate: 'dd',
      url: `/${this.lang}/offer`,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      userImage: 'assets/fake-images-for-test/three.jpg',
      stars: 5,
      translate: 'll',
      userName: 'تقشير الوجه',
      url: `/${this.lang}/offer`,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      userImage: 'assets/fake-images-for-test/four.jpg',
      stars: 5,
      translate: 'ss',
      userName: 'تنظيف الأسنان',
      url: `/${this.lang}/offer`,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      userImage: 'assets/fake-images-for-test/five.jfif',
      stars: 5,
      translate: 'kk',
      url: `/${this.lang}/offer`,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      userImage: 'assets/fake-images-for-test/sex.jfif',
      stars: 5,
      translate: 'qq',
      url: `/${this.lang}/offer`,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      userImage: 'assets/fake-images-for-test/seven.jfif',
      stars: 5,
      translate: 'oo',
      url: `/${this.lang}/offer`,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ];
  cards = [
    {
      title: 'Classic Shirt',
      description: 'Dentistry ',
      category: 'Dentistry',
    },
    {
      title: 'Casual Tee',
      description: 'Neurology .',
      category: 'Neurology',
    },
    {
      title: 'Semi Blazer',
      description: 'General Surgery .',
      category: 'General Surgery',
    },
    {
      title: 'Formal Suit',
      description: 'Perfect for business.',
      category: 'ENT',
    },

    // add more cards as needed
  ];
  filteredCards = [...this.cards];
  testimonialsOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,

    navText: [
      '<img src="assets/icons/Arrow-Left-2.svg">',
      '<img src="assets/icons/Arrow-Right-2.svg">',
    ],
    autoplay: true,
    margin: 20,
    autoplayTimeout: 2000,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 5,
      },
    },
  };

  constructor(
    private service: AppService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    private router: Router,
    private mktService: MarketingService,
    private authService: AuthenticationService,
    private StorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private metadataService: MetadataService,
    private route: RoutesPipe
  ) {
    // AOS
    // if (isPlatformBrowser(this.platformId)) {
    //   AOS.init();
    // }
  }
  showCustomView: boolean = false;
  toggleCustomView() {
    this.showCustomView = !this.showCustomView;
  }

  goToAsk(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const currentUser = localStorage.getItem('currentUser');
    const lang = this.translocoService.getActiveLang() || 'en';

    if (currentUser) {
      const targetUrl = lang === 'ar' ? '/ar/سؤال' : '/en/ask';
      this.router.navigate([targetUrl]);
      return;
    }

    // Not logged in → open login dialog
    this.dialog.open(LoginComponent, {
      width: '400px',
      height: 'auto',
    });
  }
  getPopularDoctors(specialtyId?: number): void {
    this.activeSpecialtyId = specialtyId;
    this.service.getPopularDoctors(specialtyId).subscribe({
      next: (response: ApiResponse) => {
        this.doctors = response.Data;
      },
      error: (error) => { },
    });
  }
  goToDoctorProfile(id: number, name: string): void {
    if (this.lang !== 'ar') {
      this.router.navigate(['/en/doctor', id, this.replaceSpaceWithDash(name)]);
    } else {
      this.router.navigate(['/ar/الطبيب', id, this.replaceSpaceWithDash(name)]);
    }
  }
  getTop10Specialties(): void {
    this.service.getTopSpecialist().subscribe({
      next: (response: { Data: Specialty[] }) => {
        this.topSpecialties = response.Data;
      },
      error: (error) => {
        console.error('Failed to load top specialties', error);
      },
    });
  }
  getAllSpecialties(): void {
    this.activeSpecialtyId = -1;
    this.service.getspecialist().subscribe({
      next: (response: { Data: Specialty[] }) => {
        this.topSpecialties = response.Data;
      },
      error: (error) => {
        console.error('Failed to load all specialties', error);
      },
    });
  }
  ngOnInit() {
    this.metadataService.updateMetadata('home');
    this.getMedicalExaminationType();
    this.getDoctorHealthTopics();
    this.getBlogs();
    this.getWhatsAppAds();
    this.getTop10Specialties();
    this.getoffers();
    this.getPopularDoctors();
  }
  getMedicalExaminationType() {
    this.service
      .getMedicalExaminationType()
      .pipe(map((res: any) => res['Data']))
      .subscribe((res: any) => {
        this.services = res;
      });
  }
  getDoctorHealthTopics() {
    this.service.getDoctorHealthTopics().subscribe((res: any) => {
      this.specialties = res['Data'];
    });
  }
  getWhatsAppAds() {
    this.service.getWhatsAppAds().subscribe((res: any) => { });
  }
  getBlogs() {
    this.spinner.show();
    this.service.getBlogs().subscribe((res: any) => {
      this.blogs = res['Data'];
      this.spinner.hide();
    });
  }
  getoffers() {
    this.spinner.show();
    this.service.getOffers().subscribe((res: any) => {
      this.offers = res['Data'];
      this.spinner.hide();
    });
  }
  navigateToOffer(offerId: number) {
    this.router.navigate([this.route.transform('offer'), offerId]);
  }
  replaceSpaceWithDash(name: any) {
    return name?.replace(/ /g, '-');
  }
  goToSpecialty(specialtyName: string): void {
    const slug = this.replaceSpaceWithDash(specialtyName);
    if (this.lang !== 'en') {
      this.router.navigate(['/ar/الاطباء', slug]);
    } else {
      this.router.navigate(['/en/doctors', slug]);
    }
  }

  getColClass(index: number): string {
    const sizes = [
      'col-4',
      'col-4',
      'col-4',
      'col-1',
      'col-5',
      'col-5',
      'col-1',
    ];
    return sizes[index];
  }
  bookFor(event: any, doctor: any, FeesFrom: number) {
    event.preventDefault();
    const eventData: any = this.mktService.setEventData(
      'Patient Booked Doctor Appointment',
      `View Doctor Profile`,
      ' '
    );
    this.mktService.onEventFacebook(eventData);
    this.router
      .navigate(
        [
          this.route.transform('doctor'),
          doctor.DoctorId,
          this.replaceSpaceWithDash(doctor.DoctorName),
        ],
        {
          queryParams: {
            DoctorId: doctor.DoctorId,
            ClinicId: doctor.clinicDto.ClinicId,
            AvalibleDate: this.params['AvalibleDate'],
          },
        }
      )
      .then((res) => {
        this.StorageService.setItem('doctor', JSON.stringify(doctor));
        this.StorageService.setItem('DoctorFees', doctor.FeesFrom);
      });
  }
}
