import { Component, Inject, Renderer2 } from '@angular/core';
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
import { Title, Meta } from '@angular/platform-browser';

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
  public doctorId: any = null;
  public name: any = null;
  doctor: any = null;
  languages = languages;
  selectedLanguage = this.languages[0];
  videos: any = [];
  allVideos: any = [];
  allUniqueServices: any = [];
  allInsurance: any = [];
  features: any = [];
  allImages: any = [];
  areas: any = [];
  loadingVideos = false;
  doctorFees: number | null = null;
  storageUrl = environment.storageUrl;
  EditAppointmentID = null;
  reviews: any = null;
  AvalibleDate: any = null;
  ClinicId: any = null;
  public IsEnglish = true;
  public IsArabic = false;
  lang: any;
  doctorsFeatures: any = []
  replaceSpaceWithDash(name: any) {
    return name?.replace(/ /g, '-');
  }
  constructor(
    private service: AppService,
    public route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public translocoService: TranslocoService,
    private sanitizer: DomSanitizer,
    private StorageService: LocalStorageService,
    private router: Router,
    public routesPipe: RoutesPipe,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm) => {
      const idFromRoute = pm.get('doctorId');
      const nameFromRoute = pm.get('doctorName');
      if (idFromRoute) {
        this.doctorId = idFromRoute;
      }
      if (nameFromRoute) {
        this.name = nameFromRoute;
      }
      if (this.doctorId) {
        this.getDoctorDetail(this.doctorId);
        this.getDoctorRateByDoctorIdPagedList();
      }
    });
    this.route.queryParams.subscribe((params) => {
      if (params['AvalibleDate']) {
        this.AvalibleDate = params['AvalibleDate'];
      }
      if (params['ClinicId']) {
        this.ClinicId = params['ClinicId'];
      }
      const feesFromQuery = params['fees'] ?? params['Fees'] ?? params['doctorFees'];
      if (feesFromQuery !== undefined && feesFromQuery !== null && feesFromQuery !== '') {
        const maybeNumber = Number(feesFromQuery);
        this.doctorFees = isNaN(maybeNumber) ? null : maybeNumber;
        this.StorageService.setItem('DoctorFees', this.doctorFees !== null ? String(this.doctorFees) : '');
      } else {
        const feesStored = this.StorageService.getItem('DoctorFees');
        this.doctorFees = feesStored ? Number(feesStored) : null;
      }
      if (!this.doctor && this.doctorId) {
        this.getDoctorDetail(this.doctorId);
        this.getDoctorRateByDoctorIdPagedList();
      }
    });
    this.lang = this.translocoService.getActiveLang();
  }

  addPhysicianSchema(): void {
    if (!this.doctor) return;
    const url = `https://salamtakgroup.com/en/doctor/${this.doctor.Id}/${this.doctor.FirstName}`;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Physician",
      "@id": (this.doctor.Id),
      "name": `Dr. ${this.doctor.FirstName} ${this.doctor.LastName}`,
      "url": url,
      "medicalSpecialty": this.doctor.SpecialistName,
      "priceRange": this.doctor.FeesFrom,
      "description": `${this.doctor.SeniorityLevelName} ${this.doctor.SpecialistName}`,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EG",
        "areaServed": this.doctor.clinicDtos.map((clinic: any) => ({
          "name": clinic.AreaName
        }))
      },
      "affiliation": {
        "@type": "MedicalOrganization",
        "name": "Salamtak Group",
        "url": "https://salamtakgroup.com"
      }
    };

    if (this.document.querySelector('script[data-schema="physician"]')) {
      return;
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'physician');
    script.textContent = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
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
    if (!doctorId) return;
    this.spinner.show();
    this.service
      .getDoctorDetail(doctorId, 0, new Date().toISOString().split('T')[0])
      .subscribe((res) => {
        this.spinner.hide();
        this.doctor = res['Data'];
        console.log("doctors", this.doctor);

        // Set dynamic meta title and description
        this.setDynamicMetadata();

        this.addPhysicianSchema()
        this.features = this.doctor?.Features || [];
        if (this.doctor?.clinicDtos && Array.isArray(this.doctor.clinicDtos)) {
          this.doctor.clinicDtos.forEach((clinic: any) => {
            clinic['active'] =
              this.ClinicId != null && this.ClinicId != undefined
                ? String(this.ClinicId) === String(clinic['ClinicId'])
                : false;
          });
        }
        this.areas = [
          ...new Set(
            this.doctor?.clinicDtos
              ?.map((clinic: any) => clinic.AreaName)
              .filter(Boolean)
          )
        ];

        console.log(this.areas);
        const allServices = this.doctor.clinicDtos.flatMap(
          (clinic: any) => clinic.Services || []
        );
        this.allUniqueServices = [...new Set(allServices)];

        const allImages = this.doctor.clinicDtos.flatMap(
          (clinic: any) => clinic.Gallary || []
        );
        this.allImages = allImages;

        this.allVideos = this.doctor.clinicDtos.flatMap(
          (clinic: any) => clinic.Videos || []
        );

        this.allInsurance = this.doctor.clinicDtos.flatMap(
          (clinic: any) => clinic.Insurance || []
        );

        if (
          (this.doctorFees === null || this.doctorFees === undefined) &&
          this.doctor.clinicDtos.length
        ) {
          const activeClinic =
            this.doctor.clinicDtos.find((c: any) => c.active) ??
            this.doctor.clinicDtos[0];

          if (activeClinic) {
            const clinicFees = activeClinic?.Fees ?? activeClinic?.fees;
            if (clinicFees !== undefined && clinicFees !== null && clinicFees !== '') {
              const maybeNum = Number(clinicFees);
              this.doctorFees = isNaN(maybeNum) ? null : maybeNum;
            }
          }
        }

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

  setDynamicMetadata() {
    const lang = this.translocoService.getActiveLang();
    const doctorName = lang === 'ar'
      ? `${this.doctor.FirstNameAr} ${this.doctor.LastNameAr}`
      : `${this.doctor.FirstName} ${this.doctor.LastName}`;
    const specialty = this.doctor.SpecialistName;
    const clinicAreas = this.doctor.clinicDtos.map((clinic: any) => clinic.AreaName);

    let title: string;
    let description: string;

    if (lang === 'ar') {
      title = `  د. ${doctorName} - ${specialty} في ${clinicAreas.join(', ')} - احجز موعد`;
      description = `احجز موعدك الآن مع د. ${doctorName} - ${specialty}. احصل على استشارة طبية موثوقة وتجربة طبية متميزة مع سلامتك.`;
    } else {
      title = `Dr. ${doctorName} - ${specialty} in ${clinicAreas.join(', ')} - Book Appointment`;
      description = `Book an appointment with Dr. ${doctorName} - ${specialty} in ${clinicAreas.join(', ')}. View consultation fees, clinic location, available times, and patient reviews. Book online fast`;
    }
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
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
  ngOnDestroy() {
    this.StorageService.removeItem('doctor');
  }
  sanitizeUrl(videoUrl: string): SafeResourceUrl {
    if (videoUrl) {
      const url = `https://www.youtube.com/embed/${this.extractVideoId(videoUrl)}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }
  extractVideoId(videoUrl: string): string | null {
    if (videoUrl && (videoUrl.includes('v=') || videoUrl.includes('youtu.be'))) {
      const startIndex = videoUrl.includes('v=') ? videoUrl.indexOf('v=') + 2 : videoUrl.indexOf('youtu.be') + 9;
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

  goToSubSpecial(subSpecial: any, doctorSubSpecialId: any, SpecialistName: any) {
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
