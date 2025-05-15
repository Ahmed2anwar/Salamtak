import { Component, HostListener, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs';
import * as AOS from 'aos';
import { COMPONENT_KEYWORDS } from '../../component-keywords';
import { AppService } from '../../services/app.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { DownloadAppComponent } from "../download-app/download-app.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselModule,
    TranslocoModule,
    RouterModule,
    CommonModule,
    SearchFormComponent,
    RoutesPipe,
    DownloadAppComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public blogs: any[] = []
  public offers:any[]=[]
  storageUrl = environment.storageUrl
  titleKey :any;
  descriptionKey :any;
  services = []
  popularDoctors = []
  salamtakCapId=1;
  phone = '17143';
  lang = this.translocoService.getActiveLang();


  blog = [
    {
      icon: 'assets/icons/scoopN.png',
      title: 'SalamtakScoop',
      hex : '#fff',
      url:'SalamtakScoop'
    },
    {
      icon: 'assets/icons/Salamtak Care NN.png',
      title: 'SalamtakCare',
      hex : '#fff',
      url:'SalamtakCare'
    },
    {
      icon: 'assets/icons/TrueorFN.png',
      title: 'SalamtakTrueOrFalse',
      hex : '#fff',
      url:'SalamtakTrueOrFalse'
    },
    {
      icon: 'assets/icons/SalamtakCapN.png',
      title: 'SalamtakCapsola',
      hex : '#fff',
      url:'SalamtakCapsola'
    },
    {
      icon: 'assets/icons/Salamtak promotions N.png',
      title: 'SalamtakPromotions ',
      hex : '#fff',
      url:'SalamtakPromotions'
    },
    {
      icon: 'assets/icons/icon7.png',
      title: 'emergency',
      hex : '#fff',
      url : `emergency`
    }

  ]

  medicalServices = [
    {
      icon: 'assets/icons/Hospitals.svg',
      title: 'Hospitals',
      translate: 'hospitals',
      hex : '#2B2979',
      // url : '/hospitals'
      url : 'hospitals'
    },

    {
      icon: 'assets/icons/Pharmacies.svg',
      title: 'Pharmacies',
      translate: 'pharmacies',
      hex : '#10B3AE',
      url : 'pharmacies'
    },
    // Laboratories
    {
      icon: 'assets/icons/Laboratories.svg',
      title: 'Laboratories',
      translate: 'laboratories',
      hex : '#DB8B43',
      url : 'laboratories'
    },
    {
      icon: 'assets/icons/angelmmm 1.png',
      title: 'RadiologyCenter',
      translate: 'emergency',
      hex : '#C56251',
      url : 'emergency',
    },
    {
      icon: 'assets/icons/Radiology-Center.svg',
      title: 'Radiology Centers',
      translate: 'radiology-center',
      hex : '#1690B4',
      url : 'radiology-center'
    },

  ]
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
  ]
  specialtiesOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<img src="assets/icons/Arrow-Left-2.svg">', '<img src="assets/icons/Arrow-Right-2.svg">'],
    autoplay: true,
    margin: 20,
    autoplayTimeout: 6000,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      }
    },
  }


  testimonials = [
    {
      userImage : 'assets/fake-images-for-test/one.jpg',
      stars : 5,
      userName : 'تركيب التقويم المعدني',
      translate: 'tt',
      url:`/${this.lang}/offer`,
      text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      userImage : 'assets/fake-images-for-test/two.jpg',
      stars : 5,
      userName : 'تنظيف البشرة',
      translate:'dd',
      url:`/${this.lang}/offer`,
      text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      userImage : 'assets/fake-images-for-test/three.jpg',
      stars : 5,
      translate:'ll',
      userName : 'تقشير الوجه',
      url:`/${this.lang}/offer`,
      text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
    ,
    {
      userImage : 'assets/fake-images-for-test/four.jpg',
      stars : 5,
      translate:'ss',
      userName : 'تنظيف الأسنان',
      url:`/${this.lang}/offer`,
      text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      userImage : 'assets/fake-images-for-test/five.jfif',
      stars : 5,
      translate:'kk',
      url:`/${this.lang}/offer`,
      text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      userImage : 'assets/fake-images-for-test/sex.jfif',
      stars : 5,
      translate:'qq',
      url:`/${this.lang}/offer`,
      text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      userImage : 'assets/fake-images-for-test/seven.jfif',
      stars : 5,
      translate:'oo',
      url:`/${this.lang}/offer`,
      text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },

  ]
  testimonialsOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['<img src="assets/icons/Arrow-Left-2.svg">', '<img src="assets/icons/Arrow-Right-2.svg">'],
    autoplay: true,
    margin: 20,
    autoplayTimeout: 3000,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 5
      }
    },
  }


constructor(
  private service : AppService,
  private spinner: NgxSpinnerService,
  private translocoService: TranslocoService,
   private router: Router,
   private StorageService : LocalStorageService,
   @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private metadataService: MetadataService,
    private route: RoutesPipe
) {

  // AOS
  if(isPlatformBrowser(this.platformId)) {
    AOS.init();
  }

}

showCustomView: boolean = false; // Variable to control the visibility of the custom view

// Function to toggle the visibility of the custom view
toggleCustomView() {
  this.showCustomView = !this.showCustomView;
}

  ngOnInit() {
    this.metadataService.updateMetadata('home');

    // AOS.init();
    this.getMedicalExaminationType();
    this.getPopularDoctors();
    this.getDoctorHealthTopics();
    this.getBlogs()

    this.getWhatsAppAds(); // 401 Unauthorized

    this.getoffers()
  }
  getMedicalExaminationType(){
    this.service.getMedicalExaminationType().pipe(map((res:any)=>res['Data'])).subscribe((res:any) => {
      this.services = res;
    })
  }
  getPopularDoctors(){
    this.service.getPopularDoctors().subscribe((res:any) => {
      this.popularDoctors = res;
    })
  }
  getDoctorHealthTopics(){
    this.service.getDoctorHealthTopics().subscribe((res:any) => {
      this.specialties = res['Data'];
    })
  }
  getWhatsAppAds(){
    this.service.getWhatsAppAds().subscribe((res:any) => {

    })
  }
  getBlogs() {
    this.spinner.show()
    this.service.getBlogs().subscribe((res:any) => {
      this.blogs = res['Data']
      this.spinner.hide()
    })
  }
  getoffers(){
    this.spinner.show()
    this.service.getOffers().subscribe((res:any)=>{
      this.offers=res['Data']
      this.spinner.hide()

    })

  }
  navigateToOffer(offerId: number) {

     this.router.navigate([this.route.transform('offer'), offerId]);

  }
  replaceSpaceWithDash(name:any){
    return name?.replace(/ /g, '-');
  }


   getColClass(index: number): string {
    const sizes = [
      'col-4', // size for the first card
      'col-4', // size for the second card
      'col-4', // size for the third card
      'col-1', // empty column
      'col-5', // size for the fourth card
      'col-5', // size for the fifth card
      'col-1', // empty column
    ];

    return sizes[index]
  }

}
