import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TranslocoService } from '@jsverse/transloco';
import { routesKeys } from '../routes.lang';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { DocumentService } from './document.service';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private baseUrl :any = null;

  constructor(
    private translocoService: TranslocoService,
    private http: HttpClient,
    private doc : DocumentService
  ) {
    this.baseUrl = this.doc.getHostname() + '/';
  }

  generateSitemapLinks(): Observable<string[]> {
    return forkJoin({
      doctors: this.getAllDoctors(),
      routes: this.getRoutes(),
      specialities: this.getPublicSpecialist(),
      subSpecialist : this.getSubSpecialist()
    }).pipe(
      map((response: any) => {
        const { doctors, specialities , subSpecialist , routes } = response;
        // doctors.Data.forEach((doctor:any) => {
        //   // replase * to -
        //   doctor.FullNameAR = (doctor.FullNameAR || '').replace('*', '-');
        //   doctor.FullNameEN = (doctor.FullNameEN || '').replace('*', '-');
        // })

        return this.buildLinks(doctors.Data,specialities.Data,subSpecialist.Data, routesKeys);
      })
    );
  }
  generateSitemap(): void {
    forkJoin({
      doctors: this.getAllDoctors(),
      routes: this.getRoutes(),
      specialities: this.getPublicSpecialist(),
      subSpecialist : this.getSubSpecialist()
    }).pipe(
      map((response: any) => {
        const { doctors, specialities, subSpecialist, routes } = response;
        const links = this.buildLinks(
          doctors.Data,
          specialities.Data,
          subSpecialist.Data,
          routesKeys
        );
        return this.buildSitemap(links);
      })
    ).subscribe(sitemap => {
      this.downloadSitemap(sitemap);
    });
  }

  private buildLinks(doctors: any[], specialities: any[], subSpecialist: any[],  routes: any): string[] {
    let links: string[] = [];
    for (let key in routes) {
      if (routes.hasOwnProperty(key)) {
        links.push(this.baseUrl + routes[key]['ar']);
        links.push(this.baseUrl + routes[key]['en']);
      }
    }

    //console.log(specialities)
    specialities.forEach(speciality => {
      links.push(`${this.baseUrl}en/doctors/${this.replaceSpaceWithDash(speciality.Name)}`);
      links.push(`${this.baseUrl}ar/الاطباء/${this.replaceSpaceWithDash(speciality.NameAr)}`);
    })

    subSpecialist.forEach(subSpeciality => {
      // /en/specialities/Gynaecology-and-Infertility
      links.push(`${this.baseUrl}en/specialities/${this.replaceSpaceWithDash(subSpeciality.Name)}/${this.replaceSpaceWithDash(subSpeciality.MainSpeciality)}`);
      links.push(`${this.baseUrl}ar/التخصصات/${this.replaceSpaceWithDash(subSpeciality.NameAr)}/${this.replaceSpaceWithDash(subSpeciality.MainSpecialityAr)}`);
    })

    doctors.forEach(doctor => {
      links.push(`${this.baseUrl}en/doctor/${doctor.Id}/${this.replaceSpaceWithDash(doctor.Fullname)}`);
      links.push(`${this.baseUrl}ar/الطبيب/${doctor.Id}/${this.replaceSpaceWithDash(doctor.FullNameAR)}`);
    });

    return links;
  }
  replaceSpaceWithDash(name:any){
    return name?.replace(/ /g, '-');
  }

  private buildSitemap(links: string[]): string {
    const urlset = links.map(link => `<url><loc>${link}</loc></url>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urlset}
      </urlset>`;
  }

  private downloadSitemap(sitemap: string): void {
    const blob = new Blob([sitemap], { type: 'application/xml' });
    saveAs(blob, 'sitemap.xml');
  }

  private getAllDoctors() {
    return this.http.get(`${environment.apiUrl}/Doctor/GetAllDoctors_ShortData`);
  }
  private getPublicSpecialist() {
//     GET
// ​/api​/{culture}​/Specialist​/GetListOfSpecialist

    return this.http.get<any>(`https://salamtechapi.azurewebsites.net/api/en/Specialist/GetListOfSpecialist`)
  }
  // Specialist/GetSubSpecialistList

//   GET
// ​/api​/{culture}​/Specialist​/GetListOfSubSpecialistList
  private getSubSpecialist() {
    return this.http.get<any>(`https://salamtechapi.azurewebsites.net/api/en/Specialist/GetListOfSubSpecialistList`)
  }

  private getRoutes() {
    return new Promise(resolve => resolve(routesKeys)); // محاكاة لاسترجاع routes من مكان آخر إذا لزم الأمر
  }
}





// // src/app/services/sitemap.service.ts
// import { Injectable } from '@angular/core';
// import { Routes } from '@angular/router';
// import { environment } from '../../environments/environment';
// import { TranslocoService } from '@jsverse/transloco';
// import { routesKeys } from '../routes.lang';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class SitemapService {
//   private baseUrl = (environment.apiUrl).replace('{lang}', '');

//   private routes = routesKeys;
//   constructor(
//     private translocoService: TranslocoService,
//     private http : HttpClient
//   ) { }
//   links :any = []
//   generateSitemap(): any {
//     this.getAllDoctors().subscribe((res: any) => {
//       const doctors = res['Data'];
//       doctors.forEach((doctor:any) => {
//         this.links.push(`${this.baseUrl}/en/doctors/${doctor.Id}/${doctor.Fullname}`)
//         this.links.push(`${this.baseUrl}/en/doctors/${doctor.Id}/${doctor.FullNameAR}`)
//       });

//       for (let [key, value] of Object.entries(this.routes)) {
//         var v : any = value
//         this.links.push(this.baseUrl + v['ar'])
//         this.links.push(this.baseUrl + v['en'])
//       }

//     // create sitemap file
//     let urls = '';

//     for (let i = 0; i < this.links.length; i++) {
//       urls += '<url><loc>' + this.links[i] + '</loc></url>\n';
//     }

//     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
//     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//       ${urls}
//     </urlset>`;

//     return sitemap;
//     })

//   }
//   getAllDoctors() {
//     return this.http.get(`${environment.apiUrl}/Doctor/GetAllDoctors_ShortData`,{});
//   }
// }
