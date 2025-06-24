import { Component, Inject } from '@angular/core';
import { AppService } from '../../services/app.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { languages } from '../../languages';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { BookFormComponent } from '../../shared/book-form/book-form.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,

    AccordionModule,
    FormsModule,
    BookFormComponent,
    RoutesPipe,
  ],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.scss',
})
export class DoctorProfileComponent {
  public doctorId: any = this.route.snapshot.paramMap.get('doctorId');
  public name: any = this.route.snapshot.paramMap.get('doctorName');

  doctor: any = null;
  languages = languages;
  selectedLanguage = this.languages[0];
  videos: any = [];
  allVideos: any = [];
  allUniqueServices: any = [];
  allInsurance: any = [];
  allImages: any = [];
  loadingVideos = false;
  doctorFees: number | null = null;
  storageUrl = environment.storageUrl;
  EditAppointmentID = null;
  reviews: any = null;
  AvalibleDate = null;
  ClinicId = null;
  public IsEnglish = true;
  public IsArabic = false;
  lang: any;
  replaceSpaceWithDash(name: any) {
    return name?.replace(/ /g, '-');
  }
  constructor(
    private service: AppService,
    public route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translocoService: TranslocoService,
    private sanitizer: DomSanitizer,
    private StorageService: LocalStorageService,
    private router: Router,
    public routesPipe: RoutesPipe,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.getDoctorDetail();
    this.getDoctorRateByDoctorIdPagedList();
    const fees = this.StorageService.getItem('DoctorFees');
    this.doctorFees = fees ? +fees : null;
    this.route.queryParams.subscribe((params) => {
      this.AvalibleDate = params['AvalibleDate'];
      this.ClinicId = params['ClinicId'];
    });
  }
  getDoctorVideos() {
    this.loadingVideos = true;
    this.spinner.show();
    this.service.GetDoctorVideos(this.doctorId).subscribe((res: any) => {
      this.videos = res['Data'];
      this.spinner.hide();
      this.loadingVideos = false;
    });
  }
  extractYouTubeVideoID(url: string): string {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : url;
  }
  sanitizeUrll(videoUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
  getDoctorDetail(doctorId = this.doctorId) {
    this.spinner.show();
    this.service
      .getDoctorDetail(doctorId, 0, new Date().toISOString().split('T')[0])
      .subscribe((res) => {
        this.spinner.hide();

        this.doctor = res['Data'];

        this.doctor.clinicDtos.forEach((clinic: any) => {
          clinic['active'] = this.ClinicId == clinic['ClinicId'];
        });

        const allServices = this.doctor.clinicDtos.flatMap(
          (clinic: any) => clinic.Services || []
        );

        this.allUniqueServices = [...new Set(allServices)];

        const allImages = this.doctor.clinicDtos.flatMap(
          (clinic: any) => clinic.Gallary || []
        );

        this.allVideos = this.doctor.clinicDtos.flatMap(
          (clinic: any) => clinic.Videos || []
        );
        this.allInsurance = this.doctor.clinicDtos.flatMap(
          (clinic: any) => clinic.Insurance || []
        );

        this.allImages = allImages;

        this.lang = this.translocoService.getActiveLang();
      });
  }
  getDocFullName(doctor: any) {
    return this.lang == 'en'
      ? doctor['FirstName'] +
          ' ' +
          doctor['MiddelName'] +
          ' ' +
          doctor['LastName']
      : doctor['FirstNameAr'] +
          ' ' +
          doctor['MiddelNameAr'] +
          ' ' +
          doctor['LastNameAr'];
  }
  getClinicGalleryByClinicId(clinicId: any) {
    this.spinner.show();
    var clinicImages: any = [];
    this.service.getClinicGalleryByClinicId(clinicId).subscribe((res) => {
      clinicImages.push(res['Data']);
      this.spinner.hide();
    });
    return clinicImages;
  }

  onClinicImgError(event: any, name: any) {
    event.target.src =
      'https://ui-avatars.com/api/?name=' +
      name +
      '&background=2B2979&color=fff&size=100';
  }

  scrollToElement($element: any): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  // on close component
  ngOnDestroy() {
    this.StorageService.removeItem('doctor');
  }
  sanitizeUrl(videoUrl: string): SafeResourceUrl {
    if (videoUrl) {
      const url = `https://www.youtube.com/embed/${this.extractVideoId(
        videoUrl
      )}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }

  // Extract video ID from YouTube URL
  extractVideoId(videoUrl: string): string | null {
    if (
      videoUrl &&
      (videoUrl.includes('v=') || videoUrl.includes('youtu.be'))
    ) {
      const startIndex = videoUrl.includes('v=')
        ? videoUrl.indexOf('v=') + 2
        : videoUrl.indexOf('youtu.be') + 9;
      const videoId = videoUrl.substring(startIndex, startIndex + 11);
      return videoId;
    }
    return null;
  }

  getDoctorRateByDoctorIdPagedList() {
    this.spinner.show();
    this.service
      .getDoctorRateByDoctorIdPagedList(this.doctorId, 1, 10)
      .subscribe((res) => {
        this.reviews = res['Data']['Items'];
        this.spinner.hide();
      });
  }
  goToSubSpecial(
    subSpecial: any,
    doctorSubSpecialId: any,
    SpecialistName: any
  ) {
    return;

    SpecialistName = SpecialistName?.replace(/ /g, '-');
    subSpecial = subSpecial?.replace(/ /g, '-');

    let obj = {
      Id: doctorSubSpecialId,
      Name: subSpecial,
    };
    this.StorageService.setItem('doctorSubSpecial', JSON.stringify(obj));
    this.StorageService.setItem('search-form-specialty', JSON.stringify(obj));

    this.router.navigate(
      [this.routesPipe.transform('find-a-doctor'), SpecialistName],
      { queryParams: { subSpecialist: subSpecial } }
    );
  }
}
