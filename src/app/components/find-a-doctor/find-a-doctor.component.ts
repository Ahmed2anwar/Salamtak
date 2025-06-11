import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppService } from '../../services/app.service';
import { SearchFormService } from '../../services/search-form.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { COMPONENT_KEYWORDS } from '../../component-keywords';
import { MarketingService } from '../../services/marketing.service';
import { filter, forkJoin, map, of } from 'rxjs';
import { CommonModule, NgClass } from '@angular/common';
import {
  SearchFormComponent,
  TableEnum,
} from '../../shared/search-form/search-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
// import { NgxViewerModule } from 'ngx-viewer';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Specialty } from '../../../model';

@Component({
  selector: 'app-find-a-doctor',
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
  templateUrl: './find-a-doctor.component.html',
  styleUrls: [
    // src/app/@layouts/listing-layout/listing-layout.component.scss
    '../../@layouts/listing-layout/listing-layout.component.scss',
    './find-a-doctor.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FindADoctorComponent {
  pagination = {
    MaxResultCount: 10,
    SkipCount: 0,
  };
  topSpecialties: Specialty[] = [];

  seniorityLevels: any = [];
  genders: any = [
    { id: 1, name: 'male' },
    { id: 2, name: 'female' },
  ];
  specialists: any = [];
  services: any = [];
  subSpecialists: any = [];

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
  subSpeciality: any;
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
    this.route.paramMap.subscribe((params) => {
      if (params && Object.keys(params).keys.length != 0) {
        console.clear();
        //console.log(params)
        this.doctors = [];
        this.loading = true;
        setTimeout(() => {
          this.doctorsSearch();
        }, 3000);
      }
    });

    this.route.paramMap.subscribe((params) => {
      const specialtyParam = params
        .get('specialty')
        ?.replace(/-/g, ' ')
        .toLowerCase();
    });

    this.StorageService.setItem('PAGE_CURRENT_KEY', 'find-a-doctor');

    // this.service.getSubSpecial().subscribe((res:any) => {
    //   console.log(res)
    //   if(res && Object.keys(res).length != 0){

    //     this.SubSpecial = res
    //   }else{
    //     this.SubSpecial = null

    //   }

    // })

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
    // any change for url
    // this.params = this.route.snapshot.queryParams
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        //console.log('&&&&&&&&&&&&&&&&&&&&')

        // change component prams
        var url = decodeURIComponent(this.router.url).split('/');

        //console.log(url)
        this.speciality = url[3];
        // أسنان?subSpecialist=أسنان
        // if text contain ? remove all text after ?
        if (url[3].split('?')[1]) {
          this.speciality = url[3].split('?')[0];
        } else {
          this.speciality = url[3];
        }

        //console.log(this.speciality)

        // city

        if (url[4]) {
          this.city = url[4];
        }

        if (url[5]) {
          this.area = url[5];
        }

        if (url[2] == 'doctors' || url[2] == decodeURIComponent('الاطباء')) {
          this.doctorsSearch();
          // this.setPageTitle()
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
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  currentUrl: any;
  alternativeUrl: any;

  ngOnInit(): void {
    this.getTop10Specialties();
    this.currentUrl = this.StorageService.getItem('currentUrl');
    this.alternativeUrl = this.StorageService.getItem('alternativeUrl');

    this.StorageService.setItem(
      'currentUrl',
      decodeURIComponent(this.router.url)
    );
    // if(!this.currentUrl){
    // }
    if (!this.alternativeUrl) {
      let alternativeUrl = this.routesPipe.transform('find-a-doctor', [
        this.translocoService.getActiveLang() == 'en' ? 'ar' : 'en',
      ]);
      this.StorageService.setItem(
        'alternativeUrl',
        decodeURIComponent(alternativeUrl)
      );
    }

    this.doctorsSearch();
    this.metadataService.updateMetadata('find-a-doctor');
    this.getSeniorityLevel();
    this.getspecialist();
    this.getMedicalExaminationType();
  }
  setTitle() {
    try {
      var title = '';
      this.searchTitle = this.StorageService.getItem('search-title');
      if (this.searchTitle) {
        this.metadataService.updateTitle(this.searchTitle);
      } else {
        this.metadataService.updateMetadata('find-a-doctor');
      }
      if (this.speciality) {
        this.metadataService.updateMetaDescription(this.speciality);
      }
      if (this.city) {
        this.metadataService.updateMetaDescription(this.city);
      }
      if (this.area) {
        this.metadataService.updateMetaDescription(this.area);
      }

      if (this.params['subSpecialist']) {
        let subSpecialist = this.replaceDashWithSpace(
          this.params['subSpecialist']
        );
        this.metadataService.updateTitle(subSpecialist);
      }
    } catch (error) {}
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
  getMedicalExaminationType() {
    this.service
      .getMedicalExaminationType()
      .pipe(map((res) => res['Data']))
      .subscribe((res) => {
        this.services = res;
      });
  }
  setFilter($event: any, key: any, id: any, name: any) {
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
      if (key == 'speciality') {
        //debugger
        // console.log(name)

        // this.routesPipe.transform('find-a-doctor') + '/' + name
        this.router
          .navigate([this.routesPipe.transform('find-a-doctor') + '/' + name], {
            queryParams: this.params,
          })
          .then(() => {
            window.location.reload();
          });

        return;
        // remove subSpecialist from url
        // http://localhost:4200/ar/%D8%A7%D9%84%D8%A7%D8%B7%D8%A8%D8%A7%D8%A1/%D8%A3%D8%B3%D9%86%D8%A7%D9%86?subSpecialist=%D9%85%D8%AE-%D9%88%D8%A3%D8%B9%D8%B5%D8%A7%D8%A8&title=%D9%85%D9%85%D8%A7%D8%B1%D8%B3-%D8%B9%D8%A7%D9%85
        // split / and ?
        let currentUrl: any = decodeURIComponent(this.router.url).split('/');

        currentUrl[3] = name;

        currentUrl = currentUrl.join('/');
        // remove subSpecialist from params
        let params = { ...this.params };
        delete params['subSpecialist'];
        // console.log(params)
        // debugger
        // console.log(params)
        // console.log(id)
        // console.log(name)
        let object = {
          Id: id,
          Name: this.replaceDashWithSpace(name),
        };
        this.service.setSpecialty(object);
        this.speciality = object.Name;
        this.StorageService.setItem(
          'search-form-specialty',
          JSON.stringify(object)
        );

        this.router.navigate([currentUrl], {
          queryParams: params,
        });
        this.speciality = object.Name;
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
    // this.doctorsSearch()
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

    const searchForm = JSON.parse(localStorage.getItem('search-form') || '{}');
    if (searchForm.Specialist) {
      object.SpecialistId = searchForm.Specialist['en']['Id'];
    }

    if (searchForm.City) {
      object.CityId = searchForm.City['en']['Id'];
    }

    if (searchForm.Area) {
      object.AreaId = searchForm.Area['en']['Id'];
    }

    // debugger
    // console.log('xxxxxxxxxxxxxxxxxxxxxx')

    if (this.speciality && !searchForm.Specialist) {
      // debugger
      // all specialities
      //console.log(this.speciality)
      if (
        this.speciality == 'all-specialities' ||
        this.speciality == 'كل-التخصصات'
      ) {
        requests.push(of({}));
        // return
      } else {
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
      }
    } else {
      // إذا لم يكن هناك speciality، أضف قيمة افتراضية
      requests.push(of({})); // يستخدم of لإنشاء Observable من قيمة فارغة
    }

    if (this.city && !searchForm.City) {
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

    if (this.area && !searchForm.Area) {
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

    if (this.params['title']) {
      const titleReq = this.service
        .getNameInOtherLanguage(
          TableEnum.SeniorityLevel,
          this.replaceDashWithSpace(this.params['title'])
        )
        .pipe(map((res: any) => ({ SeniortyLevelId: res.Id, res: res })));
      requests.push(titleReq);
    } else {
      requests.push(of({}));
    }

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

    if (this.params['subSpecialist']) {
      const subSpecialistReq = this.service
        .getNameInOtherLanguage(
          TableEnum.SubSpeciality,
          this.replaceDashWithSpace(this.params['subSpecialist'])
        )
        .pipe(map((res: any) => ({ SubSpecialistId: [res.Id], res: res })));
      requests.push(subSpecialistReq);
    } else {
      requests.push(of({}));
    }

    // تنفيذ جميع الطلبات بالتوازي
    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        let alternativeUrl = this.routesPipe.transform('find-a-doctor', [
          this.translocoService.getActiveLang() == 'en' ? 'ar' : 'en',
        ]);
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

        // console.log('============================')

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
              // console.log(object)
              if (object.SpecialistId) {
                this.doctors = [];
                this.getSubSpecialist(object.SpecialistId);
                this.doctors = res['Items'];
              } else {
                this.doctors = [...this.doctors, ...res['Items']];
              }

              // getSubSpecialist

              // console.log(res['Items']);
              // this.doctors = [...this.doctors, ...res['Items']];

              // this.doctors = res['Items']
              // this.setPageTitle(res.TotalCount)

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
    let title = `${this.translocoService.translate(
      'search-form.Book-with-the-best'
    )} ${doctorsCount} ${this.translocoService.translate(
      'search-form.doctor'
    )}`;
    if (this.speciality) {
      title = `${this.translocoService.translate(
        'search-form.Book-with-the-best'
      )} ${doctorsCount} ${this.translocoService.translate(
        'search-form.doctor'
      )} ${this.speciality}`;
    }
    if (this.params['subSpecialist']) {
      title = `${this.translocoService.translate(
        'search-form.Book-with-the-best'
      )} ${doctorsCount} ${this.translocoService.translate(
        'search-form.doctor'
      )} ${this.params['subSpecialist']}`;
    }
    // debugger
    // console.log(this.city)
    if (this.city) {
      title = `${this.translocoService.translate(
        'search-form.Book-with-the-best'
      )} ${doctorsCount} ${this.translocoService.translate(
        'search-form.doctor'
      )} ${this.speciality} ${this.translocoService.translate(
        'search-form.in'
      )} ${this.city}`;
    }
    if (this.area) {
      title = `${this.translocoService.translate(
        'search-form.Book-with-the-best'
      )} ${doctorsCount} ${this.translocoService.translate(
        'search-form.doctor'
      )} ${this.speciality} ${this.translocoService.translate(
        'search-form.in'
      )} ${this.area}`;
    }

    title = this.replaceDashWithSpace(title);
    this.metadataService.updateTitle(title, 'find-a-doctor');
    this.metadataService.updateMetaDescription(title, 'find-a-doctor');
  }
  setPageDescription(description: any) {
    // this.metadataService.updateMetaDescription(description)
  }

  filter(
    MaxResultCount = 10,
    SkipCount = 0,
    specialistId?: any,
    cityId?: any,
    areaId?: any
  ) {}

  setParam(key: any, value: any) {
    // this.router.navigate(['/patient/find-a-doctor']);
    var params = {
      ...this.params,
      [key]: value,
    };
    // this.router.navigate([`/${this.translocoService.getActiveLang()}/find-a-doctor`]
    this.router.navigate([this.routesPipe.transform('find-a-doctor')], {
      queryParams: params,
    });
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
        // MedicalExamationTypes not found for {Doctor/GetDoctorProfileByDoctorId} api so i save it in localstorage  to use it in doctor-profile component
        this.StorageService.setItem('doctor', JSON.stringify(doctor));
        this.StorageService.setItem('DoctorFees', doctor.FeesFrom);
      });
  }

  SubSpecial = null;
  goToSubSpecial(name: any, id: any, SpecialistName: any) {
    //console.log(this.speciality)
    //console.log(this.city)
    //console.log(this.area)

    this.router.navigate([
      this.routesPipe.transform('find-a-doctor-by-sub-specialty'),
      this.replaceSpaceWithDash(name),
      this.speciality,
      this.city,
      this.area,
    ]);
    // { path: routeName('find-a-doctor-by-sub-specialty','en') + "/:specialty" , component: FindADoctorBySubSpecialtyComponent},
    return;

    // this.doctors = []
    // replace space with dash
    SpecialistName = SpecialistName?.replace(/ /g, '-');

    name = name?.replace(/ /g, '-');

    let obj: any = {
      Id: id,
      Name: name,
    };

    if (name != this.speciality) {
      obj.name = this.replaceDashWithSpace(obj.name);
      this.SubSpecial = obj.Name;
      this.service.setSubSpecial(obj);
    }
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

  getSubSpecialtyLink(subspecialist: any, doctor: any) {
    const SpecialistName = this.replaceSpaceWithDash(doctor.SpecialistName);
    // this.speciality = SpecialistName
    let url =
      this.routesPipe.transform('find-a-doctor-by-sub-specialty') +
      '/' +
      this.replaceSpaceWithDash(subspecialist.Name);
    if (SpecialistName) {
      url = url + '/' + SpecialistName;
    }
    if (SpecialistName && this.city) {
      url = url + '/' + this.city;
    }
    if (SpecialistName && this.city && this.area) {
      url = url + '/' + this.area;
    }
    return url;
  }

  ngOnDestroy(): void {
    // remove search bar items
    this.StorageService.removeItem('search-title');
    this.StorageService.removeItem('search-form');
    this.StorageService.removeItem('PAGE_CURRENT_KEY');

    this.service.setSpecialty(null);
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

    // http://localhost:4200/ar/%D8%A7%D9%84%D8%AA%D8%AE%D8%B5%D8%B5%D8%A7%D8%AA/%D9%86%D8%B3%D8%A7%D8%A1-%D9%88%D8%AA%D9%88%D9%84%D9%8A%D8%AF/%D9%86%D8%B3%D8%A7%D8%A1-%D9%88%D8%AA%D9%88%D9%84%D9%8A%D8%AF
    // this.router.navigate([this.routesPipe.transform('find-a-doctor-by-sub-specialty') , sub.Name])
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
