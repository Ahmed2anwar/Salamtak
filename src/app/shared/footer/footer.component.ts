import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import Swal from 'sweetalert2';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    RoutesPipe
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  isCollapsed = false;
  lang = this.translocoService.getActiveLang();
  constructor( public translocoService: TranslocoService,
    private routesPipe: RoutesPipe,


    ) { }
  goto(){

    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translocoService.setActiveLang(lang);
      if (lang === 'ar') {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
        window.open('/patient/termsOfAr')

      }
      else {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
        window.open('/patient/termsOf')

      }
    }


 
  }
  gotoPrivacy(){

    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translocoService.setActiveLang(lang);
      if (lang === 'ar') {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
        window.open('/patient/privacyPolicyAr')

      }
      else {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
        window.open('/patient/privacyPolicy')

      }
    }
  }

  gotoDoctorPrivacy(){

    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translocoService.setActiveLang(lang);
      if (lang === 'ar') {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
        window.open('/patient/doctorPrivacyAr')

      }
      else {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
        window.open('/patient/doctorPrivacy')

      }
    }
  }
  gotoDoctorWebsite(){
    window.open('https://doctor.salamtakgroup.com')
  }
  gotoDoctorWebsi(){
    Swal.fire({
      title: this.translocoService.translate('swal.Soon.title'),
      icon: 'question',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translocoService.translate('swal.Soon.ConfirmButtonText')
    })
  }
  collapse(){
    this.isCollapsed = !this.isCollapsed;
  }
}
