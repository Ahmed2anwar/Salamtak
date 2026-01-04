import { environment } from './../../environments/environment.development';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AppService } from '../services/app.service';
import { Router } from '@angular/router';
import { RoutesPipe } from '../pipes/routes.pipe';
import { LocalStorageService } from '../services/local-storage.service';
import { DownloadAppComponent } from '../components/download-app/download-app.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CarouselModule,
    TranslocoModule,
    RouterModule,
    CommonModule,
    RoutesPipe,
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss',
})
export class OffersComponent {
  constructor(
    private spinner: NgxSpinnerService,

    private service: AppService,
    private translocoService: TranslocoService,
    private router: Router,
    private StorageService: LocalStorageService,
    private route: RoutesPipe
  ) {}
  public offers: any[] = [];
  storageUrl = environment.storageUrl;
  lang = this.translocoService.getActiveLang();
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
    ngOnInit(): void {
    this.getoffers();
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
}
