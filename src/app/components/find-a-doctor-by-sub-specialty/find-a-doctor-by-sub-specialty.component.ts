import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RoutesPipe } from '../../pipes/routes.pipe';
import {
  SearchFormComponent,
  TableEnum,
} from '../../shared/search-form/search-form.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter, map, of, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppService } from '../../services/app.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { MarketingService } from '../../services/marketing.service';
import { MetadataService } from '../../services/metadata.service';
import { SearchFormService } from '../../services/search-form.service';
import { Specialty } from '../../../model';

@Component({
  selector: 'app-find-a-doctor-by-sub-specialty',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    SearchFormComponent,
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    CdkAccordionModule,
    AccordionModule,
    MatDatepickerModule,
    RoutesPipe,
    InfiniteScrollModule,
    // NgxViewerModule
  ],
  providers: [MatDatepickerModule],
  templateUrl: './find-a-doctor-by-sub-specialty.component.html',
  styleUrls: [
    // src/app/@layouts/listing-layout/listing-layout.component.scss
    '../../@layouts/listing-layout/listing-layout.component.scss',
    '../../components/find-a-doctor/find-a-doctor.component.scss',
    './find-a-doctor-by-sub-specialty.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FindADoctorBySubSpecialtyComponent {
  pagination = {
    MaxResultCount: 10,
    SkipCount: 0,
  };

  seniorityLevels: any = [];
  genders: any = [
    { id: 1, name: 'male' },
    { id: 2, name: 'female' },
  ];
  specialists: any = [];
  services: any = [];
  subSpecialists: any = [];
  topSpecialties: Specialty[] = [];
  public subSpeciality: any = this.route.snapshot.paramMap.get('sub-specialty');
  subSpecialityId: any;
  public speciality: any = this.route.snapshot.paramMap.get('specialty');
  public speciality2: any = this.route.snapshot.paramMap.get('specialty');

  public city: any = this.route.snapshot.paramMap.get('city');
  public area: any = this.route.snapshot.paramMap.get('area');

  public params: any;
  titleKey: any;
  descriptionKey: any;
  data: any;
  available: any;
  searchTitle: any;
  public doctors: any = [];
  public filterObject: any;
  loading = false;
  storageUrl = environment.storageUrl;

  todayDate: any = new Date();
  minDate: Date = new Date();
  FeesFrom: any;
  FeesTo: any;
  lang = this.translocoService.getActiveLang();
  public doctorViewerOptions: any = {
    navbar: false,
    toolbar: false,
    title: false,
    movable: false,
  };

  isDropdownOpen = false; //New
  isSmallScreen = false; //New

  constructor(
    private service: AppService,
    private form: SearchFormService,
    private route: ActivatedRoute,
    private mktService: MarketingService,
    public translocoService: TranslocoService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private StorageService: LocalStorageService,
    private metadataService: MetadataService,
    public routesPipe: RoutesPipe
  ) {
    this.StorageService.setItem(
      'PAGE_CURRENT_KEY',
      'find-a-doctor-by-sub-specialty'
    );

    this.service.getSubSpecial().subscribe((res: any) => {
      //console.log(res)
      if (res && Object.keys(res).length != 0) {
        this.SubSpecial = res;
      } else {
        this.SubSpecial = null;
      }
    });

    this.route.queryParams.subscribe((params: any) => {
      //console.log(params)
      this.params = params;

      if (params.price) {
        // FeesFrom
        this.FeesFrom = params.price.split(',')[0];
        this.FeesTo = params.price.split(',')[1];
      }

      if (params.subSpecialist) {
        //console.log(params.subSpecialist)
        this.SubSpecial = params.subSpecialist;

        // this.doctorsSearch()
      }
    });

    this.setPageTitle();

    const currentdate = new Date();
    const year = currentdate.getFullYear();
    const month = this.padZero(currentdate.getMonth() + 1);
    const day = this.padZero(currentdate.getDate());
    this.available = `${year}-${month}-${day}`;
  }
  isScrolled = false;
  onScroll() {
    // this.isScrolled = true
    // this.doctorsSearch()
  }
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  currentUrl: any;
  alternativeUrl: any;

  getTop10Specialties(): void {
    this.service.getTopSpecialist().subscribe({
      next: (response: { Data: Specialty[] }) => {
        this.topSpecialties = response.Data;
      },
      error: (error) => {},
    });
  }
  goToSpecialty(specialtyName: string): void {
    const slug = this.replaceSpaceWithDash(specialtyName);
    this.router.navigate(['/en/doctors', slug]);
  }
  ngOnInit(): void {
    this.currentUrl = this.StorageService.getItem('currentUrl');
    this.alternativeUrl = this.StorageService.getItem('alternativeUrl');

    this.StorageService.setItem(
      'currentUrl',
      decodeURIComponent(this.router.url)
    );
    // if(!this.currentUrl){
    // }
    if (!this.alternativeUrl) {
      let alternativeUrl = this.routesPipe.transform(
        'find-a-doctor-by-sub-specialty',
        [this.translocoService.getActiveLang() == 'en' ? 'ar' : 'en']
      );
      this.StorageService.setItem(
        'alternativeUrl',
        decodeURIComponent(alternativeUrl)
      );
    }
    this.metadataService.updateMetadata('find-a-doctor-by-sub-specialty');

    this.getSeniorityLevel();
    this.getspecialist();
    this.getMedicalExaminationType();
    this.doctorsSearch();
    this.getTop10Specialties();


  }
  setTitle() {

  }
   goToSubSpecialFromFilter(sub: any) {
    //console.log(sub)
    var name = '';
    // (this.translocoService.getActiveLang() == 'en' ? name = sub.Name : sub.NameAr);
    if (this.translocoService.getActiveLang() == 'en') {
      name = sub.Name;
    } else {
      name = sub.NameAr;
    }
    this.router.navigate([
      this.routesPipe.transform('find-a-doctor-by-sub-specialty'),
      this.replaceSpaceWithDash(name),
      // this.speciality,
      ...(this.speciality ? [this.speciality] : []),
      // this.city,
      ...(this.city ? [this.city] : []),
      // this.area
      ...(this.area ? [this.area] : []),
    ]);
  }
  getSeniorityLevel() {
    return this.service
      .getSeniorityLevel()
      .pipe(map((res) => res['Data']))
      .subscribe((res) => {
        this.seniorityLevels = res;
      });
  }
  getspecialist() {
    return this.service
      .getspecialist()
      .pipe(map((res) => res['Data']))
      .subscribe((res) => {
        this.specialists = res;
      });
  }
  getSubSpecialist(id: any) {
    return this.service
      .getListOfSubSpecialistList(id)
      .pipe(map((res) => res['Data']))
      .subscribe((res) => {
        this.subSpecialists = res;
        //console.log(res)
      });
  }
  getMedicalExaminationType() {
    this.service
      .getMedicalExaminationType()
      .pipe(map((res) => res['Data']))
      .subscribe((res) => {
        this.services = res;
      });
  }
  setFilter($event: any, key: any, id: any, name: any, sub: any = null) {
    this.loading = true;
    // this.doctors = []

    // scroll to top
    try {
      window.scroll({ top: 400, left: 0, behavior: 'smooth' });
    } catch (error) {}

    // Remove leading and trailing spaces & Replace spaces with - in the name, but only if the name has more than one word
    name = name.trim();
    name = name.includes(' ') ? name.replace(/\s+/g, '-') : name;

    // add this keys in query params
    const queryParamsKeys = ['gender', 'title', 'date', 'service', 'price'];
    if (!queryParamsKeys.includes(key)) {
      // (speciality) This is part of the URL, not query params.
      // debugger
      // console.log(key)
      // console.log(sub)
      // debugger

      if (key == 'subSpeciality') {
        // debugger
        // console.log(sub)
        // debugger
        // this.getSubSpecialist(object['SpecialistId'])
        let currentUrl: any = decodeURIComponent(this.router.url).split('/');
        //console.log(currentUrl)
        currentUrl[3] = this.replaceSpaceWithDash(name);

        currentUrl = currentUrl.join('/');

        //console.log(currentUrl)
        this.doctors = [];
        this.router.navigate([currentUrl]).then(() => {
          // this.doctorsSearch()
          window.location.reload();
        });
        return;
      }

      setTimeout(() => {
        // this.doctorsSearch()
      }, 500);
      return;
    }

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: {
          [key]: name,
        },
        queryParamsHandling: 'merge',
      })
      .then(() => {
        window.location.reload();
      });
    // setTimeout(() => {
    //   this.doctorsSearch()
    // }, 500);
  }
  // this.speciality = this.speciality?.replace(/-/g, ' ');
  replaceDashWithSpace(text: any) {
    try {
      text = text?.replace(/-/g, ' ');
      text = text?.includes('?') ? text?.split('?')[0] : text;
    } catch (error) {}
    return text;
  }
  replaceSpaceWithDash(name: any) {
    return name?.replace(/ /g, '-');
  }
  // {
  //   "MaxResultCount": 2147483647,
  //   "SkipCount": 2147483647,
  //   "DoctorName": "string",
  //   "SpecialistId": 0,
  //   "CityId": 0,
  //   "AreaId": 0,
  //   "SubAreaId": 0,
  //   "GenderId": 0,
  //   "FeesFrom": 0,
  //   "FeesTo": 0,
  //   "SeniortyLevelId": 0,
  //   "SubSpecialistId": [
  //     0
  //   ],
  //   "MedicalExaminationTypeId": 0,
  //   "AvalibleDate": "2024-08-19T00:32:46.990Z",
  //   "InsuranceID": "string"
  // }

  // MaxResultCount = 10, SkipCount = 0

  doctorsSearch() {
    let object: any = {
      MaxResultCount: this.pagination.MaxResultCount,
      SkipCount: this.pagination.SkipCount,
    };

    this.loading = true;

    // قائمة الطلبات التي سيتم تنفيذها
    const requests = [];

    // this.doctors = []

    // if(!this.alternativeUrl){
    //   // this.StorageService.setItem('alternativeUrl', this.router.url);
    // }
    // إضافة طلبات إذا كانت القيم موجودة

    // const searchForm = JSON.parse(localStorage.getItem('search-form') || '{}')
    // if(searchForm.Specialist){
    //   object.SpecialistId = searchForm.Specialist['en']['Id']
    // }

    // if(searchForm.City){
    //   object.CityId = searchForm.City['en']['Id']
    // }

    // if(searchForm.Area){
    //   object.AreaId = searchForm.Area['en']['Id']
    // }

    if (this.subSpeciality) {
      const subSpecialistReq = this.service
        .getNameInOtherLanguage(
          TableEnum.SubSpeciality,
          this.replaceDashWithSpace(this.subSpeciality)
        )
        .pipe(map((res: any) => ({ SubSpecialistId: [res.Id], res: res })));
      requests.push(subSpecialistReq);
      // this.subSpecialityId = subSpecialistReq
    } else {
      // إذا لم يكن هناك speciality، أضف قيمة افتراضية
      requests.push(of({})); // يستخدم of لإنشاء Observable من قيمة فارغة
    }

    if (this.speciality) {
      // debugger
      // all specialities
      console.log(this.speciality);
      if (
        this.speciality == 'all-specialities' ||
        this.speciality == 'كل-التخصصات'
      ) {
        requests.push(of({}));
        return;
      }
      const specialityReq = this.service
        .getNameInOtherLanguage(
          TableEnum.Speciality,
          this.replaceDashWithSpace(this.speciality)
        )
        .pipe(
          map((res: any) => ({
            SpecialistId: res.Id,
            res: res,
          }))
        );
      requests.push(specialityReq);
    } else {
      // إذا لم يكن هناك speciality، أضف قيمة افتراضية
      requests.push(of({})); // يستخدم of لإنشاء Observable من قيمة فارغة
    }

    if (this.city) {
      const cityReq = this.service
        .getNameInOtherLanguage(
          TableEnum.City,
          this.replaceDashWithSpace(this.city)
        )
        .pipe(map((res: any) => ({ CityId: res.Id, res: res })));
      requests.push(cityReq);
    } else {
      requests.push(of({})); // قيمة افتراضية إذا لم يكن هناك city
    }

    if (this.area) {
      const areaReq = this.service
        .getNameInOtherLanguage(
          TableEnum.Area,
          this.replaceDashWithSpace(this.area)
        )
        .pipe(map((res: any) => ({ AreaId: res.Id, res: res })));
      requests.push(areaReq);
    } else {
      requests.push(of({})); // قيمة افتراضية إذا لم يكن هناك area
    }

    // if(this.params['title']){
    //   const titleReq = this.service
    //     .getNameInOtherLanguage(TableEnum.SeniorityLevel, this.replaceDashWithSpace(this.params['title']))
    //     .pipe(map((res: any) => ({ SeniortyLevelId: res.Id , res : res})));
    //   requests.push(titleReq);

    // }else{
    //   requests.push(of({}));
    // }

    // MedicalExaminationTypeId
    if (this.params['service']) {
      const serviceReq = this.service
        .getNameInOtherLanguage(
          TableEnum.MediacalType,
          this.replaceDashWithSpace(this.params['service'])
        )
        .pipe(
          map((res: any) => ({ MedicalExaminationTypeId: res.Id, res: res }))
        );
      requests.push(serviceReq);
    } else {
    }
    // console.log(params.subSpecialist)

    // if (this.params['subSpecialist']) {

    //   const subSpecialistReq = this.service
    //     .getNameInOtherLanguage(TableEnum.SubSpeciality, this.replaceDashWithSpace(this.params['subSpecialist']))
    //     .pipe(map((res: any) => ({ SubSpecialistId: [res.Id], res : res })));
    //   requests.push(subSpecialistReq);

    // } else {
    //   requests.push(of({}));
    // }

    // تنفيذ جميع الطلبات بالتوازي
    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        let alternativeUrl = this.routesPipe.transform(
          'find-a-doctor-by-sub-specialty',
          [this.translocoService.getActiveLang() == 'en' ? 'ar' : 'en']
        );

        console.clear();
        // console.log(alternativeUrl)
        results.forEach((result, index) => {
          Object.assign(object, result);
          // console.log(result)
          if (result.res && index <= 2) {
            alternativeUrl = alternativeUrl + '/' + result.res.Name;
          }
          // switch (index) {
          //   case 0: // speciality
          //   break
          //   case 1:
          //   alternativeUrl = alternativeUrl += result.Name;

          // }
        });

        // console.log(results)
        // console.log(object)
        // console.log(res)
        //console.log(alternativeUrl)
        this.StorageService.setItem(
          'alternativeUrl',
          this.replaceSpaceWithDash(decodeURIComponent(alternativeUrl))
        );

        //console.log('============================')

        // إضافة معلومات الاستعلام
        if (this.params['doctorName']) {
          object.DoctorName = this.params['doctorName'];
        }

        if (this.params['gender']) {
          object.GenderId = this.params['gender'] === 'male' ? 1 : 2;
        }
        if (this.params['date']) {
          object.AvalibleDate = this.params['date'];
        }
        // price=10,200
        if (this.params['price']) {
          const [FeesFrom, FeesTo] = this.params['price']
            .split(',')
            .map((value: any) => (value !== 'null' ? Number(value) : null));

          if (FeesFrom !== null) {
            object.FeesFrom = FeesFrom;
          }

          if (FeesTo !== null) {
            object.FeesTo = FeesTo;
          }
        }
        // if()

        // لسه هجيب الداتا من ال api
        // if (this.params['title']) {
        //   object.SeniortyLevelId = this.params['title'] === 'male' ? 1 : 2;
        // }

        // البحث عن الأطباء بعد جمع جميع المعرفات الضرورية
        // this.spinner.show()
        this.setPageTitle();
        this.service
          .findDoctorsByFilters(object)
          .pipe(map((res: any) => res['Data']))
          .subscribe({
            next: (res) => {
              //console.log(object)
              if (object['SpecialistId']) {
                this.getSubSpecialist(object['SpecialistId']);
              }

              // this.subSpecialityId = object['SubSpecialistId'][0]
              // if(object['SpecialistId']){
              //   // debugger
              //   // this.doctors = []
              //   this.getSubSpecialist(object['SpecialistId'])
              //   // this.doctors = res['Items']
              // }else{
              //   this.doctors = [...this.doctors, ...res['Items']]
              // }
              this.doctors = [...this.doctors, ...res['Items']];

              // console.log(res['Items']);
              // this.doctors = [...this.doctors, ...res['Items']];

              // this.doctors = res['Items']
              this.setPageTitle(res.TotalCount);

              // {{'search-form.Book-with-the-best-doctor' | transloco}}

              // @if(selectedSpecialty && (selectedSpecialty.length > 0)){
              //  @if(SubSpecial){
              //    {{SubSpecial['Name'] || ''}}
              //  } @else {
              //   {{selectedSpecialty ? (selectedSpecialty[0]['Name'] || '') : ''}}
              //  }
              // }

              // this.metadataService.updateTitle('xxxxxxxxxxxxxxxxxxxxxxxxx')

              // let doctorsCount = res.TotalCount;
              // let title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')}`
              // if(this.speciality){
              //   title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')} ${this.speciality}`
              // }
              // if(this.params['subSpecialist']){
              //   title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')} ${this.params['subSpecialist']}`
              // }
              // if(this.city){
              //   title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')} ${this.speciality} ${this.translocoService.translate('search-form.in')} ${this.city}`
              // }
              // this.metadataService.updateTitle(title)

              // this.metadataService.updateTitle(
              //   `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount}
              //   ${this.translocoService.translate('search-form.doctor')}
              //   `
              // )
              // this.metadataService.updateDescription(this.descriptionKey)

              // this.pagination.MaxResultCount = this.pagination.MaxResultCount + 10
              // this.pagination.SkipCount = this.pagination.SkipCount + res['Items'].length;

              // this.pagination.TotalCount = res['TotalCount'];
              // filterObject?.SkipCount + 10

              this.loading = false;
              // this.spinner.hide()
            },
            error: (err) => {
              console.log(err);
              this.loading = false;
              this.spinner.hide();
            },
          });
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  setPageTitle(doctorsCount: any = null) {
    // if(doctorsCount == 0 || !doctorsCount){
    //   doctorsCount = ''
    // }
    doctorsCount = '';
    // Book with the best doctor Allergy and Immunology in Abou Keir
    // احجز مع افضل دكتور أسنان في أسوان

    var subSpeciality = this.replaceDashWithSpace(this.subSpeciality);
    const lang = this.translocoService.getActiveLang();
    const titleAr = `ابحث عن افضل ${doctorsCount} دكتور ${subSpeciality}`;
    const titleEn = `Book with the best ${doctorsCount} doctor ${subSpeciality}`;
    var title = lang == 'en' ? titleEn : titleAr;

    // let title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')}`
    // // if(this.speciality){
    // //   title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')} ${this.speciality}`
    // // }
    // if(this.subSpeciality){
    //   title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')} ${this.replaceDashWithSpace(this.subSpeciality)}`
    // }
    // // debugger
    // // console.log(this.city)
    // if(this.city){
    //   title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')} ${this.speciality} ${this.translocoService.translate('search-form.in')} ${this.city}`
    // }
    // if(this.area){
    //   title = `${this.translocoService.translate('search-form.Book-with-the-best')} ${doctorsCount} ${this.translocoService.translate('search-form.doctor')} ${this.speciality} ${this.translocoService.translate('search-form.in')} ${this.area}`
    // }
    this.metadataService.updateTitle(title, 'find-a-doctor-by-sub-specialty');
    this.metadataService.updateMetaDescription(
      title,
      'find-a-doctor-by-sub-specialty'
    );

    this.StorageService.setItem(
      'filterTitle',
      JSON.stringify({
        ar: titleAr,
        en: titleEn,
      }),
      'session'
    );
  }
  setPageDescription(description: any) {
    // this.metadataService.updateMetaDescription(description)
  }
  // getNameInOtherLanguage(id:any,name:any,key:any){
  //   if(name == null || name == undefined){
  //     return
  //   }
  //   // remove - and replace with space
  //   name = name?.replace(/-/g, ' ');

  //   this.service.getNameInOtherLanguage(id,name).subscribe((res:any)=>{
  //     console.log(res)
  //     this.StorageService.setItem(key,JSON.stringify(res))
  //     this.searchForm[key] = res
  //     console.log(this.searchForm)
  //   })
  // }

  filter(
    MaxResultCount = 10,
    SkipCount = 0,
    specialistId?: any,
    cityId?: any,
    areaId?: any
  ) {
    //     this.loading = true;
    //     var FeesFrom :any= this.StorageService.getItem('FeesFrom');
    //     var cty=1;
    // if(!FeesFrom)
    // FeesFrom=0;
    // if(this.params['CityId'])
    // cty=this.params['CityId'];
    //   // let Specialist = JSON.parse(this.StorageService.getItem('search-form-specialty') || 'null');
    //   // let city = JSON.parse(this.StorageService.getItem('search-form-city') || 'null');
    //   // let area = JSON.parse(this.StorageService.getItem('search-form-area') || 'null');
    // //
    //     var filter = {
    //       "MaxResultCount": MaxResultCount,
    //       //  this.filterObject?.SkipCount + 10
    //       "SkipCount": SkipCount,
    //       // ...(this.params['City'] && {CityId: +this.params['CityId']}),
    //       ...(this.params['Specialist'] && {SpecialistId: specialistId}),
    //       ...(this.params['City'] && {CityId: cityId}),
    //       ...(this.params['Area'] && {AreaId: areaId}),
    //       // ...(this.params['Specialist'] && {SpecialistId: this.StorageService.getItem('search-form-specialty')}),
    //       // ...(this.params['AreaId'] && {AreaId: +this.params['AreaId']}),
    //       // ...(this.params['CityId'] && {CityId: +this.params['CityId']}),
    //       // ...(this.params['SpecialistId'] && {SpecialistId: +this.params['SpecialistId']}),
    //       // ...(this.params['AreaId'] && {AreaId: +this.params['AreaId']}),
    //       ...(this.params['DoctorName'] && {DoctorName: this.params['DoctorName']}),
    //       // ... ( {CityId: +cty}),
    //       ...(this.params['MedicalExaminationTypeId'] && {MedicalExaminationTypeId: +this.params['MedicalExaminationTypeId']}),
    //       ...(this.params['GenderId'] && {GenderId: +this.params['GenderId']}),
    //       ...(this.params['SeniortyLevelId'] && {SeniortyLevelId: +this.params['SeniortyLevelId']}),
    //       // .toISOString().split('T')[0]
    //       ...(this.params['AvalibleDate'] && { AvalibleDate: (this.params['AvalibleDate']) }),
    //       ...( {FeesFrom: +FeesFrom}),
    //       ...(this.params['FeesTo'] && {FeesTo: +this.params['FeesTo']}),
    //       // البحث بالتخصص الفرعي
    //       ...(this.params['SubSpecialistId'] && {SubSpecialistId: [+this.params['SubSpecialistId']]}),
    //     }
    //     this.filterObject = filter
    //     this.spinner.show()
    //     this.service.findDoctorsByFilters(filter).pipe(map((res:any)=>res['Data']['Items'])).subscribe(res=>{
    //       const eventData: any = this.mktService.setEventData(
    //         'Patient Search for doctor',
    //         `Search for a Doctor`,
    //         " ",
    //       );
    //       this.mktService.onEventFacebook(eventData);
    //       this.doctors = [...this.doctors, ...res]
    //       this.loading = false
    //       // setTimeout(() => {
    //       // }, 10000);
    //       this.spinner.hide()
    //     })
  }

  // appendParam(key, value){
  //   var url = new URL(window.location.href);
  //     url.searchParams.set(key, value);
  //     window.history.pushState({}, '', url.href);
  // }
  setParam(key: any, value: any) {
    // this.router.navigate(['/patient/find-a-doctor']);
    var params = {
      ...this.params,
      [key]: value,
    };
    // this.router.navigate([`/${this.translocoService.getActiveLang()}/find-a-doctor`]
    this.router.navigate(
      [this.routesPipe.transform('find-a-doctor-by-sub-specialty')],
      { queryParams: params }
    );
  }
  selectGender(event: any, id: any) {
    if (event.target.checked) {
      this.setParam('GenderId', id);
    }
  }
  selectSeiority(event: any, id: any) {
    if (event.target.checked) {
      this.setParam('SeniortyLevelId', id);
    }
  }
  selectspeciality(event: any, id: any, Name: any) {
    if (event.target.checked) {
      // this.setParam('SpecialistId',id)
      this.setParam('Specialist', Name);
      this.StorageService.setItem('search-form-specialty', id);
    }
  }
  selectService(event: any, id: any) {
    if (event.target.checked) {
      this.setParam('MedicalExaminationTypeId', id);
    }
  }
  selectPrice(from: any, to: any) {
    if (from && to) {
      if (from > to) return;
      this.setParam('FeesFrom', from);
      this.StorageService.setItem('FeesFrom', from);
      this.setParam('FeesTo', to);
      this.filter();
    }
    if (from) {
      if (from < 0) return;
      this.setParam('FeesFrom', from);
      this.filter();
    }
    if (to) {
      if (to < 0) return;
      this.setParam('FeesTo', to);
      this.filter();
    }

    return;
    if (from && to) {
      if (from > to) return;
    }

    if (from) {
      if (from < 0) return;
      this.setParam('FeesFrom', from);
    }
    if (to) {
      if (to < 0) return;
      this.setParam('FeesTo', to);
    }
    this.filter();
  }
  dateChange(event: any) {
    var value = event.target._elementRef.nativeElement.value;
    var result = new Date(value);
    result.setDate(new Date(value).getDate());
    var d = result.getDate();
    var m = result.getMonth() + 1;
    var mon = m.toString().length === 1 ? '0' + m : m;
    var day = d.toString().length === 1 ? '0' + d : d;
    var y = result.getFullYear();
    var AppDate = y + '-' + mon + '-' + day;
    const iosDate = new Date(result).toISOString().split('T')[0];
    var cut = iosDate.substring(0, iosDate.length - 0);

    // this.setParam('AvalibleDate',AppDate)
    this.setFilter(event, 'date', AppDate, AppDate);
  }

  // @HostListener("window:scroll", ["$event"])
  // onWindowScroll() {
  //   // if page is scrolled to bottom
  //   if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 300) {

  //     if(this.doctors.length < this.filterObject.MaxResultCount) return
  //     this.filter(this.filterObject.MaxResultCount + 10,this.filterObject?.SkipCount + 10)
  //   }

  // }

  SubSpecial = null;
  goToSubSpecial(name: any, id: any, SpecialistName: any) {
    //console.log(name)
    this.subSpeciality = name;
    this.router
      .navigate([
        this.routesPipe.transform('find-a-doctor-by-sub-specialty'),
        this.replaceSpaceWithDash(name),
      ])
      .then((res) => {
        this.doctors = [];
        this.pagination.MaxResultCount = 10;
        this.pagination.SkipCount = 0;
        this.loading = true;
        this.doctorsSearch();
      });

    return;

    // this.doctors = []
    // replace space with dash
    SpecialistName = SpecialistName?.replace(/ /g, '-');

    name = name?.replace(/ /g, '-');

    let obj: any = {
      Id: id,
      Name: name,
    };

    // if(name != this.speciality){
    //   obj.name = this.replaceDashWithSpace(obj.name)
    //   this.SubSpecial = obj.Name
    //   this.service.setSubSpecial(obj)

    // }
    // this.StorageService.setItem('search-form-specialty',JSON.stringify(obj))

    this.StorageService.setItem('doctorSubSpecial', JSON.stringify(obj));
    // this.StorageService.setItem('search-form-specialty',JSON.stringify({
    //   Id: id,
    //   Name: this.replaceDashWithSpace(name)
    // }))
    // this.metadataService.updateTitle(
    //   this.replaceDashWithSpace(name)
    // )

    // if(SpecialistName && !this.city && !this.area){
    this.router.navigate(
      [
        this.routesPipe.transform('find-a-doctor'),
        SpecialistName,
        //  ...(this.city ? [this.city] : []),
        //  ...(this.area ? [this.area] : [])
      ],
      { queryParams: { subSpecialist: name } }
    );
    // }
    // if(this.city && !this.area){
    //   this.router.navigate([this.routesPipe.transform('find-a-doctor') , SpecialistName,this.city] , { queryParams: { subSpecialist: name } });
    // }
    // if(this.city && this.area){
    //   this.router.navigate([this.routesPipe.transform('find-a-doctor') , SpecialistName,this.city,this.area] , { queryParams: { subSpecialist: name } });
    // }

    // let url = new URL(window.location.href);
    // console.log(url);
    // url.searchParams.append('subSpecialist' , name);
    // console.log(url)
    // // go to url
    // this.router.navigate([url])

    // return
    // this.router
    this.doctorsSearch();
  }
   bookFor(event: any, doctor: any) {
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
          this.routesPipe.transform('doctor'),
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
        console.log('Doctor:', doctor);
      
      });
  }
  getSubSpecialtyLink(subspecialist: any, doctor: any) {
    const SpecialistName = this.replaceSpaceWithDash(doctor.SpecialistName);

    let url =
      this.routesPipe.transform('find-a-doctor-by-sub-specialty') +
      '/' +
      this.replaceSpaceWithDash(subspecialist.Name);
    if (this.speciality) {
      url = url + '/' + this.speciality;
    }
    if (this.speciality && this.city) {
      url = url + '/' + this.city;
    }
    if (this.speciality && this.city && this.area) {
      url = url + '/' + this.area;
    }
    return url;
  }
  ngOnDestroy(): void {
    // remove search bar items
    this.StorageService.removeItem('search-title');
    // this.StorageService.removeItem('search-form')
    this.StorageService.removeItem('PAGE_CURRENT_KEY');
    // this.StorageService.removeItem('alternativeUrl')
    // this.StorageService.removeItem('currentUrl')

    // filterTitle
    this.StorageService.removeItem('filterTitle', 'session');

    // this.StorageService.removeItem('search-form-specialty')
    this.service.setSpecialty(null);
  }
  // (change)="goToSpecialist($event,level['Id'],level['Name'])"
  goToSpecialist(event: any, Id: any, Name: any) {
    //console.log(event,Id,Name)
    // /doctors/
    this.router.navigate([
      this.routesPipe.transform('find-a-doctor'),
      this.replaceSpaceWithDash(Name),
    ]);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 991; // Adjust the width as needed
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
