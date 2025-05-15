import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class SearchFormService {
  // private specialists: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  // public getSpecialists(): Observable<any> { return this.specialists.asObservable()}
  // // public setRefresh(value: any): void { this.specialists.next(value) }

  // private cities: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  // public getCities(): Observable<any> { return this.cities.asObservable()}

  // private areas: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  // public getAreas(): Observable<any> { return this.areas.asObservable()}
  // public setAreas(value: any): void { this.areas.next(value) }

  private form = new BehaviorSubject<any>(false);
  public getForm(): Observable<any> { return this.form.asObservable()}
  public setForm(value: any): void { this.form.next(value) }

  constructor(
    private http: HttpClient,
    private transloco : TranslocoService
  ) {
      // this.getPublicSpecialist()
      // this.getPublicCities()
  }

  getSpecialists() {
    return this.http.get<any>(`${environment.apiUrl}/Specialist/GetSpecialist`)
  }
  getCities(CountryId = 1){
    return this.http.get<any>(`${environment.apiUrl}/City/GetCities?CountryId=${CountryId}`)
  }
  getAreas(cityId:any){
    return this.http.get<any>(`${environment.apiUrl}/Area/GetAreasByCityId?cityId=${cityId}`)
  }



  getNameInOtherLanguage(tableType: number,name: string) {
    return this.http.get(`${environment.apiUrl}/LookUp/GetNameInOtherLanguage?tableType=${tableType}&name=${name}`);
  }
  replaceDashWithSpace(text:any){
    text = text?.replace(/-/g, ' ');
    text = text?.includes('?') ? text?.split('?')[0] : text
    return text;
  }
  replaceSpaceWithDash(text:any){
    text = text?.replace(/ /g, '-');
    return text;
  }
  generateTitle(specialty: any, city: any, area: any): string {
    let title = this.transloco.translate('search-form.Book-with-the-best-doctor');

    if (specialty?.length > 0) {
      title += ` ${specialty[0]?.Name}`;
    }

    if (area && area.length > 0) {
      title += ` ${this.transloco.translate('search-form.in')} ${area[0]?.Name}`;
    } else if (city && city.length > 0) {
      title += ` ${this.transloco.translate('search-form.in')} ${city[0]?.Name}`;
    }

    return title;
  }
}
