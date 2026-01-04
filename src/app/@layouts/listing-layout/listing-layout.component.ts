import { Component, ViewEncapsulation } from '@angular/core';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-listing-layout',
  standalone: true,
  imports: [
    RouterModule,
    SearchFormComponent
],
  templateUrl: './listing-layout.component.html',
  styleUrl: './listing-layout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ListingLayoutComponent {
  // __URL:string = ""
  // isHideSearch = false

  // constructor(router : Router) {
  //   this.__URL = router.url
  //   this.removeSearchBar()
  //   router.events.pipe(filter((event:any) => event instanceof NavigationEnd)).subscribe((event: any) => {
  //     this.__URL = event.urlAfterRedirects
  //   this.removeSearchBar()


  //   })


  // //  router.events
  // // .pipe(
  // //   filter(e => e instanceof NavigationEnd)
  // // )
  // // .subscribe( (navEnd:any) => {
  // //   if (
  // //     navEnd.urlAfterRedirects.includes('booking-successfully')

  // //     ) {
  // //     this.isHideSearch = true
  // //   }else{
  // //     this.isHideSearch = false
  // //   }
  // //   // get route name from url
  // // });
  // }
  // removeSearchBar(){

  //   // remove search bar from booking-successfully and doctor-profile page
  //   if(this.__URL.includes('find-a-doctor') || this.__URL.includes('%D8%A7%D8%A8%D8%AD%D8%AB%20%D8%B9%D9%86%20%D8%B7%D8%A8%D9%8A%D8%A8')){
  //     this.isHideSearch = false
  //   }else{
  //     this.isHideSearch = true
  //   }
  //     return

  //   if (
  //     this.__URL.includes('booking-successfully') ||
  //     this.__URL.includes('blogs') ||
  //     this.__URL.includes('about') ||
  //     this.__URL.includes('contact-us') ||
  //     this.__URL.includes('appointments') ||
  //     this.__URL.includes('my-schedule') ||
  //     this.__URL.includes('patient') ||
  //     this.__URL.includes('change-password')
  //     ) {
  //     this.isHideSearch = true
  //   }else{
  //     this.isHideSearch = false
  //   }
  // }
}
