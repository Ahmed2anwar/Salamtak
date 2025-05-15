import { Component, ViewChild, ViewEncapsulation, viewChild } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SearchFormService } from '../../services/search-form.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {MatSelectModule} from '@angular/material/select';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { CommonModule } from '@angular/common';
import { MetadataService } from '../../services/metadata.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { forkJoin, of, switchMap, tap } from 'rxjs';
import { AppService } from '../../services/app.service';
// import { MatSelectFilterModule } from '../../../assets/libs/mat-select-filter';
export enum TableEnum {
  SeniorityLevel = 1,
  Speciality = 2,
  MediacalType = 3,
  City = 4,
  Area = 5,
  SubSpeciality = 6
}


@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    TranslocoModule,
    MatSelectModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    CommonModule
    // MatSelectFilterModule
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  encapsulation:ViewEncapsulation.None
})



export class SearchFormComponent {
  dropdownSettings:IDropdownSettings = {
    singleSelection: true,
    idField: 'Id',
    textField: 'Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    searchPlaceholderText:  "Search",
    closeDropDownOnSelection: true
  };

  subSpecialtyTitle:any;
  subSpecialtyUrlValue:any = this.service.replaceDashWithSpace(this.route.snapshot.paramMap.get('sub-specialty'))

  form:any = {
    loading : false,
    specialty:{
      list : [],
      urlValue : this.service.replaceDashWithSpace(this.route.snapshot.paramMap.get('specialty')),
      selectedValue : []
    },
    city:{
      list : [],
      urlValue : this.service.replaceDashWithSpace(this.route.snapshot.paramMap.get('city')),
      selectedValue : []
    },
    area:{
      list : [],
      urlValue : this.service.replaceDashWithSpace(this.route.snapshot.paramMap.get('area')),
      selectedValue : []
    },
    doctorName : null
  }
  constructor(
    private service: SearchFormService,
    private router: Router,
    private route: ActivatedRoute,
    public translocoService: TranslocoService,
    private routesPipe : RoutesPipe,
    private metadataService : MetadataService,
    private storage : LocalStorageService,
    public language : TranslocoService,
    private appSer :AppService
  ) {
    this.route.paramMap.subscribe(params => {
      this.form.specialty.urlValue = this.service.replaceDashWithSpace(params.get('specialty'));
      this.form.city.urlValue = this.service.replaceDashWithSpace(params.get('city'));
      this.form.area.urlValue = this.service.replaceDashWithSpace(params.get('area'));
      this.loadFormData();
    })
      setInterval(() => {
        this.subSpecialtyTitle = JSON.parse(this.storage.getItem('filterTitle','session') || '{}')
      }, 1000);
  }

  ngOnInit(): void {
    this.loadFormData()
    this.checkForDoctorName()
  }

  loadFormData() {
    // Set loading to true before starting requests
    this.form.loading = true;

    // Use forkJoin to load both specialists and cities in parallel
    forkJoin({
      specialists: this.service.getSpecialists(),
      cities: this.service.getCities()
    }).pipe(
      switchMap((res: any) => {
        // console.clear();
        // console.log('Specialists response:', res.specialists);
        // console.log('Cities response:', res.cities);

        // Assign the results after loading completes
        this.form.specialty.list = res.specialists.Data || [];
        this.form.city.list = res.cities.Data || [];

        // Check if urlValue exists and set selectedValue for specialty
        const specialtyUrlValue = this.form.specialty.urlValue;
        const cityUrlValue = this.form.city.urlValue;
        //console.log(specialtyUrlValue)

        if (specialtyUrlValue) {
          if (specialtyUrlValue !== 'all specialities' && specialtyUrlValue !== 'كل التخصصات') {
            const foundSpecialty = this.form.specialty.list.find(
              (specialty: any) => specialty.Name === specialtyUrlValue
            );
            this.form.specialty.selectedValue = [{"Id": foundSpecialty.Id, "Name": foundSpecialty.Name}];
          }
        }

        // Find the city based on the URL value and get areas if city exists
        if (cityUrlValue) {
          const foundCity = this.form.city.list.find(
            (city: any) => city.Name === cityUrlValue
          );
          this.form.city.selectedValue = [{"Id": foundCity.Id, "Name": foundCity.Name}];

          // Fetch areas based on the selected city
          return this.service.getAreas(foundCity.Id); // Get areas based on selected city Id
        }

        // If no city value, just return an empty observable
        return of({ Data: [] });
      })
    ).subscribe(
      (areasRes: any) => {
        // Handle areas response
        //console.log('Areas response:', areasRes);
        this.form.area.list = areasRes.Data || [];

        // Check if urlValue exists and set selectedValue for area
        const areaUrlValue = this.form.area.urlValue;
        if (areaUrlValue) {
          const foundArea = this.form.area.list.find(
            (area: any) => area.Name === areaUrlValue
          );
          this.form.area.selectedValue = [{"Id": foundArea.Id, "Name": foundArea.Name}];
        }



        // Set loading to false after all data is loaded
        this.form.loading = false;
      },
      (error) => {
        console.error('Error loading form data:', error);
        // Set loading to false in case of an error
        this.form.loading = false;
      }
    );
  }
  checkForDoctorName() {
    this.route.queryParams.subscribe((params:any) => {
      if (params.doctorName) {
        this.form.doctorName = params.doctorName;
      }
    });
  }



  getAreas(event: any) {
    const cityId = event.Id
    this.form.loading = true
    this.service.getAreas(cityId).subscribe((res:any) => {
      this.form.area.list = res.Data
      this.form.loading = false
    })
  }

  search() {
    // Check if only the doctorName is provided
    if (
      this.form.specialty.selectedValue.length === 0 &&
      this.form.city.selectedValue.length === 0 &&
      this.form.area.selectedValue.length === 0 &&
      this.form.doctorName
    ) {
      // Navigate to the search route with the exact doctorName as a query parameter
      this.router.navigate([this.routesPipe.transform('find-a-doctor')], {
        queryParams: {
          doctorName: this.form.doctorName.trim(), // Use the exact name without replacing spaces
        },
      });
      return;
    }

    // Handle other cases (specialty, city, area, etc.)
    const lang = this.language.getActiveLang();
    let url = `${this.routesPipe.transform('find-a-doctor')}`;

    // Specialty
    if (this.form.specialty.selectedValue.length > 0) {
      url += `/${this.service.replaceSpaceWithDash(this.form.specialty.selectedValue[0].Name)}`;
    } else {
      url += `/${lang === 'ar' ? 'كل-التخصصات' : 'all-specialities'}`;
    }

    // City
    if (this.form.city.selectedValue.length > 0) {
      url += `/${this.service.replaceSpaceWithDash(this.form.city.selectedValue[0].Name)}`;
    }

    // Area
    if (this.form.area.selectedValue.length > 0) {
      url += `/${this.service.replaceSpaceWithDash(this.form.area.selectedValue[0].Name)}`;
    }

    // Navigate with query parameters
    this.router.navigate([url], {
      queryParams: {
        ...(this.form.doctorName && { doctorName: this.form.doctorName.trim() }), // Use the exact name
      },
    });
  }













































    // search() {
    //   // تحقق إذا كانت جميع الفلاتر فارغة باستثناء DoctorName
    //   if (!this.selectedSpecialty && !this.selectedCity && !this.selectedArea && !this.name) {
    //     this.router.navigate([this.routesPipe.transform('find-a-doctor')]);
    //     return;
    //   }



    //   this.SubSpecial = null
    //   this.appSer.setSubSpecial(null)
    //   // removee a

    //   this.searchLoading = true;

    //   let form: any = {
    //     ...(this.name && { DoctorName: this.replaceSpaceWithDash(this.name) }),
    //     ...(this.selectedSpecialty?.length && { Specialist: this.selectedSpecialty[0] }),
    //     ...(this.selectedCity?.length && { City: this.selectedCity[0] }),
    //     ...(this.selectedArea?.length && { Area: this.selectedArea[0] }),
    //   };

    //   const lang = this.language.getActiveLang();
    //   const otherLang = lang === 'ar' ? 'en' : 'ar';

    //   let url = `${this.routesPipe.transform('find-a-doctor')}`;

    //   if (form.Specialist) {
    //     url += `/${form.Specialist.Name.replace(/\s+/g, '-') || (lang === 'ar' ? 'كل-التخصصات' : 'all-specialities')}`;
    //   } else {
    //     url += `/${lang === 'ar' ? 'كل-التخصصات' : 'all-specialities'}`;
    //   }

    //   if (form.City) {
    //     url += `/${form.City.Name.replace(/\s+/g, '-')}`;
    //   }

    //   if (form.Area) {
    //     url += `/${form.Area.Name.replace(/\s+/g, '-')}`;
    //   }

    //   // حالة البحث باستخدام DoctorName فقط
    //   if (!this.selectedSpecialty && !this.selectedCity && !this.selectedArea && this.name) {
    //     this.router.navigate([url], {
    //       queryParams: { doctorName: this.replaceSpaceWithDash(this.name) }
    //     });
    //     this.searchLoading = false;
    //     return;
    //   }

    //   let nameByLanguage: any = { Specialist: {}, City: {}, Area: {} };
    //   let requests: any[] = [];

    //   const addRequest = (key: string, tableEnum: TableEnum, name: string) => {
    //     requests.push(
    //       this.service.getNameInOtherLanguage(tableEnum, name).pipe(
    //         tap((res: any) => {
    //           nameByLanguage[key] = { [lang]: form[key], [otherLang]: res };
    //         })
    //       )
    //     );
    //   };

    //   if (form.Specialist) addRequest('Specialist', TableEnum.Speciality, form.Specialist.Name);
    //   if (form.City) addRequest('City', TableEnum.City, form.City.Name);
    //   if (form.Area) addRequest('Area', TableEnum.Area, form.Area.Name);

    //   forkJoin(requests).subscribe({
    //     next: () => {
    //       this.searchLoading = false;

    //       Object.keys(nameByLanguage).forEach(key => {
    //         if (Object.keys(nameByLanguage[key]).length === 0) {
    //           delete nameByLanguage[key];
    //         }
    //       });

    //       const urlParts = url.split('/');
    //       const currentLangIndex = urlParts.findIndex(part => part === lang);

    //       if (currentLangIndex !== -1) {
    //         urlParts[currentLangIndex] = otherLang;
    //         let altUrl = urlParts.join('/');

    //         Object.keys(nameByLanguage).forEach(key => {
    //           const langData = nameByLanguage[key][otherLang];
    //           if (langData) {
    //             altUrl = altUrl.replace(new RegExp(form[key].Name.replace(/\s+/g, '-'), 'g'), langData.Name.replace(/\s+/g, '-'));
    //           }
    //         });

    //         altUrl = decodeURIComponent(altUrl)
    //         // altUrl = altUrl.replace('doctors', 'الاطباء');
    //         if(this.language.getActiveLang() == 'en'){
    //           altUrl = altUrl.replace('doctors', 'الاطباء');
    //           console.log('if')
    //         }else{
    //           altUrl = altUrl.replace('الاطباء', 'doctors');
    //           console.log('else')
    //         }

    //         // let alternativeUrl = altUrl.replace('الاطباء', 'doctors')
    //         this.storage.setItem('currentUrl', url);
    //         this.storage.setItem('alternativeUrl', altUrl);
    //         this.storage.setItem('search-form', JSON.stringify(nameByLanguage));

    //         // this.getDoctorSearchTitle()

    //         this.router.navigate([url], {
    //           queryParams: { ...(this.replaceSpaceWithDash(form.DoctorName)) && { doctorName: this.replaceSpaceWithDash(form.DoctorName) } }
    //         }).then(() => {
    //           this.searchLoading = false;
    //           window.location.reload();
    //         })
    //       }
    //     },
    //     error: ($error) => {
    //       console.log($error);
    //       this.searchLoading = false;
    //     }
    //   });
    // }








  // #selectedCity
  // @ViewChild('selectedCity') selectedCity: any;



  // dropdownList = [
  //   { item_id: 1, item_text: 'Mumbai' },
  //   { item_id: 2, item_text: 'Bangaluru' },
  //   { item_id: 3, item_text: 'Pune' },
  //   { item_id: 4, item_text: 'Navsari' },
  //   { item_id: 5, item_text: 'New Delhi' }
  // ];


  // public variables2 = [{ id: 0, name: 'One' }, { id: 1, name: 'Two' }];
  // public filteredList5 = this.variables2.slice();
//   selectedSpecialtyControl = new FormControl('', this.requiredSelectValidator());

//   name :any = null
//   // specialists
//   // public filteredSpecialists:any ;
//   selectedCity : any;

//   // City
//   public cities :any;
//   // public filteredCities :any ;

//   // Areas
//   filterTitle :any;
//   public areas :any
//   // public filteredAreas :any ;
//   selectedArea: any;
//   SubSpecial :any;
//   searchForm :any;
//   // public specialty = this.route.snapshot.paramMap.get('specialty')
//   public city = this.route.snapshot.paramMap.get('city')
//   public area = this.route.snapshot.paramMap.get('area')

// requiredSelectValidator(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const value = control.value;
//     return value ? null : { 'required': true };
//   };
// }

//       setInterval(() => {
//         this.searchForm = JSON.parse(this.storage.getItem('search-form') || '{}')
//         this.filterTitle = JSON.parse(this.storage.getItem('filterTitle','session') || '{}')
//         // this.filterTitle = this.storage.getItem('filterTitle')
//       }, 1000);

//     this.route.queryParams.subscribe((params:any) => {
//       if(params.subSpecialist){
//         console.log(params.subSpecialist)
//         this.SubSpecial = {
//           Name : this.replaceDashWithSpace(params.subSpecialist)
//         }

//         // this.doctorsSearch()
//       }
//     })



//     // this.appSer.getSpecialty().subscribe((res:any) => {
//     //   if(res && Object.keys(res).length != 0){

//     //     console.log(res)
//     //     this.selectedSpecialty = [JSON.parse(this.storage.getItem('search-form-specialty') || 'null')]
//     //   }

//     // })
//     this.appSer.getSubSpecial().subscribe((res:any) => {
//       if(res && Object.keys(res).length != 0){
//         this.SubSpecial = res
//       }

//     })
//     // this.service.setSubSpecial(obj)

//     // this.service.getSpecialists().subscribe((res:any) => {
//     //   this.specialists = res;
//     //   if(this.specialty){
//     //     // console.clear()
//     //     try {
//     //     this.selectedSpecialty = [JSON.parse(this.storage.getItem('search-form') || 'null')['Specialist'][this.language.getActiveLang()]]

//     //     } catch (error) {

//     //     }
//     //   }

//     //   // this.route.queryParams.subscribe((params:any) => {
//     //   //   if(params){
//     //   //     // var specialty :any=  JSON.parse(this.storage.getItem('search-form-specialty') || 'null');
//     //   //     // specialty = [JSON.parse(this.storage.getItem('search-form-specialty') || 'null')];
//     //   //     // if(specialty && specialty.length != 0){
//     //   //     //   this.selectedSpecialty = [specialty]
//     //   //     // }
//     //   //     if(this.specialty){
//     //   //       this.selectedSpecialty = [JSON.parse(this.storage.getItem('search-form') || 'null')['Specialist'][this.language.getActiveLang()]]
//     //   //     }

//     //   //     // this.StorageService.setItem('doctorSubSpecialId',doctorSubSpecialId)
//     //   //     // var SpecialtyId = JSON.parse(this.storage.getItem('doctorSubSpecialId') || 'null');
//     //   //     // if(specialty){

//     //   //     // }

//     //   //     // this.selectedSpecialty = specialty ? [JSON.parse(this.storage.getItem('search-form-specialty') || 'null')] : null
//     //   //   }
//     //   // })
//     // })
//     this.service.getCities().subscribe((res:any) => {
//       this.cities = res;
//       if(this.city){
//         try {
//           this.selectedCity = [JSON.parse(this.storage.getItem('search-form') || 'null')['City'][this.language.getActiveLang()]]
//         this.getAreas(this.selectedCity[0].Id)
//         } catch (error) {

//         }
//       }
//       // this.route.queryParams.subscribe((params:any) => {
//       //   if(params){
//       //     if(this.city){
//       //       this.selectedCity = [JSON.parse(this.storage.getItem('search-form') || 'null')['City'][this.language.getActiveLang()]]
//       //       this.getAreas(this.selectedCity[0].Id)
//       //     }
//       //     // var city :any = JSON.parse(this.storage.getItem('search-form-city') || 'null');
//       //     // if(city && city.length != 0){
//       //     //   // this.selectedCity = [city]

//       //     // }
//       //     // if(city){
//       //     //   this.selectedCity = city ? [JSON.parse(this.storage.getItem('search-form-city') || 'null')] : null
//       //     //   this.getAreas(this.selectedCity[0].Id)
//       //     // }
//       //   }
//       // })
//     })
//     this.service.getAreas().subscribe((res:any) => {
//       this.areas = res;
//       if(this.area){
//         // alert()
//         try {
//           // this.selectedArea = [JSON.parse(this.storage.getItem('search-form') || 'null')['Area'][this.language.getActiveLang()]]

//         } catch (error) {

//         }
//       }
//       // this.route.queryParams.subscribe((params:any) => {
//       //   if(params){
//       //     var area :any = JSON.parse(this.storage.getItem('search-form-area') || 'null');
//       //     if(area && area.length != 0){
//       //       this.selectedArea = [area]
//       //     }
//       //     // this.selectedArea = area ? [JSON.parse(this.storage.getItem('search-form-area') || 'null')] : null
//       //   }
//       // })

//     })





//   }

//   // ngOnInit(): void {

//   //   // this.getSpecialists()
//   //   // this.getCities()
//   // }


//   getAreas(cityId:any) {
//     // let cityId = e.Id;

//     this.areas = []

//     // this.filteredAreas = this.areas.slice();
//     this.selectedArea = null
//     this.service.getPublicAreas(cityId)


//     // alert(this.area)
//     // console.clear()
//     // console.log('xxxxxxxxxxxxxxxxxxxxxx1111xxxxxxxxxxxxxxxxxxxxxx')
//     // console.log(this.area)
//     console.log('xxxxxxxxxxxxxxxxxxxxxx22222xxxxxxxxxxxxxxxxxxxxxx')

//     // debugger
//     if(this.area){

//       this.service.getAreas().subscribe((res:any) => {
//         // console.log(res)
//         this.selectedArea = res.filter((area:any) => area.Name == this.replaceDashWithSpace(this.area))
//       })
//       // setTimeout(() => {
//       //   // this.selectedArea = this.areas.filter((area:any) => area.Name == this.replaceDashWithSpace(this.area))
//       //   // console.log(this.areas)

//       //   console.log(this.areas)
//       //   this.areas.foreach((element:any) => {
//       //     if(element.Name == this.replaceDashWithSpace(this.area)){
//       //       this.selectedArea = [element]
//       //     }
//       //   })
//       // }, 1000);
//       // this.selectedArea.forEach((element:any) => {
//       //   element.Name = this.replaceDashWithSpace(element.Name)
//       // });
//     }
//   }


//   getAreasFromDropdown(eveny:any){
//     this.getAreas(eveny.Id)
//   }
//   replaceDashWithSpace(text:any){
//     text = text?.replace(/-/g, ' ');
//     text = text?.includes('?') ? text?.split('?')[0] : text
//     return text;
//   }
//   replaceSpaceWithDash(text:any){
//     text = text?.replace(/ /g, '-');
//     return text;
//   }


//   searchLoading = false





//   setTitle(){
//     // this.getDoctorSearchTitle()


//     // var title = this.translocoService.translate('search-form.Book-with-the-best-doctor') + '  '
//     // if(this.selectedSpecialty){
//     //   title = title + this.selectedSpecialty[0]['Name'] + '  '
//     // }
//     // if(this.selectedCity){
//     //   title =  title + '  ' +  this.translocoService.translate('search-form.in') + '  ' + this.selectedCity[0]['Name']
//     // }
//     // if(this.selectedArea){
//     //   title = title + '  ' +  this.translocoService.translate('search-form.in') + '  ' + this.selectedArea[0]['Name']
//     // }
//     // if(this.name){
//     //   // title =  title +  this.translocoService.translate('search-form.by-name') + this.name
//     //   title =   this.name
//     // }
//     // if(!title){
//     //   this.metadataService.updateMetadata('find-a-doctor');
//     // }
//     // this.metadataService.updateTitle(title)

//     // this.storage.setItem('search-title',title)

//   }


//   setSelectedSpecialty(e:any){




//     this.storage.setItem('search-form-specialty', JSON.stringify(e))
//   }

//   // setSelectedCity(e:any){

//   //   // this.areas = []
//   //   // this.selectedArea = null
//   //   // this.storage.removeItem('search-form-area')

//   //   // this.storage.setItem('search-form-city', JSON.stringify(e))

//   //   // getAreasFromDropdown($event);
//   //   this.getAreasFromDropdown(e)


//   // }

//   // setSelectedArea(e:any){

//   //   // this.storage.setItem('search-form-area', JSON.stringify(e))
//   // }
//   // deselectoption(key:any){
//   //   // console.log(key)
//   //   // switch(key){
//   //   //   case 'search-form-specialty':
//   //   //     // this.selectedSpecialty = []
//   //   //     break

//   //   //   case 'search-form-city':
//   //   //     this.selectedCity = []
//   //   //     this.selectedArea = []

//   //   //     break

//   //   //   case 'search-form-area':
//   //   //     this.selectedArea = []
//   //   //     break

//   //   // }
//   //   // this.storage.removeItem(key)
//   // }

//   ngOnDestroy(): void {
//     // this.storage.removeItem('search-form-specialty')
//     // this.storage.removeItem('search-form-city')
//     // this.storage.removeItem('search-form-area')
//     this.storage.removeItem('filterTitle')


//   }
//   getNameInOtherLanguage(id:any,name:any,key:any){
//     if(name == null || name == undefined){
//       return
//     }
//     // remove - and replace with space
//     name = name?.replace(/-/g, ' ');

//     this.service.getNameInOtherLanguage(id,name).subscribe((res:any)=>{
//       // console.log(res)

//     })
//   }














// //   @if((selectedSpecialty && selectedSpecialty.length > 0 || specialty) || (selectedCity && selectedCity.length > 0) || (selectedArea && selectedArea.length > 0) || name){
// //     <h3 class="text-info">
// //        {{'search-form.Book-with-the-best-doctor' | transloco}}
// //        @if(selectedSpecialty && (selectedSpecialty.length > 0) || specialty){

// //         @if(SubSpecial){
// //           {{SubSpecial['Name'] || ''}}
// //         } @else {
// //          {{searchForm?.Specialist ? (searchForm['Specialist'][translocoService.getActiveLang()]['Name'] || '') : selectedSpecialty ? (selectedSpecialty[0]['Name'] || '') : ''}}
// //           @if(specialty && (!selectedSpecialty || selectedSpecialty.length == 0)){
// //             {{replaceDashWithSpace(specialty)}}
// //           }
// //         }
// //        }
// //       @if(selectedCity && (selectedArea == null) && (selectedCity && selectedCity.length > 0)){
// //       {{'search-form.in' | transloco}}
// //       {{(selectedCity[0]['Name'] || '')}}
// //       }
// //       @if(selectedCity && (selectedArea && selectedArea.length > 0)){
// //       {{'search-form.in' | transloco}}
// //       {{(selectedArea[0]['Name'] || '')}}
// //       }
// //       @if(selectedCity && (selectedArea && selectedArea.length > 0)){
// //       {{'search-form.in' | transloco}}
// //       {{(selectedArea[0]['Name'] || '')}}
// //       }
// //
// //     </h3>
// // }
// // getDoctorSearchTitle(): any {
// //   // let title = this.translocoService.translate('search-form.Book-with-the-best-doctor');

// //   // if ((this.selectedSpecialty && this.selectedSpecialty.length > 0 || this.specialty) ||
// //   //     (this.selectedCity && this.selectedCity.length > 0) ||
// //   //     (this.selectedArea && this.selectedArea.length > 0) ||
// //   //     this.name) {

// //   //   if (this.selectedSpecialty && (this.selectedSpecialty.length > 0) || this.specialty) {
// //   //     if (this.SubSpecial) {
// //   //       title += ' ' + (this.SubSpecial['Name'] || '');
// //   //     } else {
// //   //       title += ' ' + (this.searchForm?.Specialist ? (this.searchForm['Specialist'][this.translocoService.getActiveLang()]['Name'] || '')
// //   //                : this.selectedSpecialty ? (this.selectedSpecialty[0]['Name'] || '')
// //   //                : '');

// //   //       if (this.specialty && (!this.selectedSpecialty || this.selectedSpecialty.length === 0)) {
// //   //         title += ' ' + this.replaceDashWithSpace(this.specialty);
// //   //       }
// //   //     }
// //   //   }

// //   //   if (this.selectedCity && (!this.selectedArea) && this.selectedCity.length > 0) {
// //   //     title += ' ' + this.translocoService.translate('search-form.in') + ' ' + (this.selectedCity[0]['Name'] || '');
// //   //   }

// //   //   if (this.selectedCity && this.selectedArea && this.selectedArea.length > 0) {
// //   //     title += ' ' + this.translocoService.translate('search-form.in') + ' ' + (this.selectedArea[0]['Name'] || '');
// //   //   }
// //   // }
// //   // this.storage.setItem('search-title',title)
// //   // this.metadataService.updateTitle(title)
// //   // return title;
// // }




















}

