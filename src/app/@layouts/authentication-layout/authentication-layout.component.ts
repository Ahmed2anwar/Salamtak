import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ContactUsComponent } from '../../components/contact-us/contact-us.component';
import { languages } from '../../languages';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-authentication-layout',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    FormsModule,
    RouterModule,
    CarouselModule,
    MatMenuModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    // BrowserModule
  ],
  templateUrl: './authentication-layout.component.html',
  styleUrl: './authentication-layout.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers:[
    // BrowserAnimationsModule,
    // BrowserModule
  ]
})
export class AuthenticationLayoutComponent {
  languages = languages;
  public IsEnglish=false;
  public IsArabic=true;
  phone = '17143'
  selectedLanguage = this.languages[0];
  isCollapsed: any = false;
  lang = this.translocoService.getActiveLang();
  reviewsOwlOptions :OwlOptions = {
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    items: 1,
    slideTransition: 'linear',
  }
  constructor(private translocoService: TranslocoService,public dialog: MatDialog,public StorageService : LocalStorageService) {
    this.selectedLanguage = this.languages.find((lang:any) => lang.code === this.translocoService.getActiveLang());
  }
  setLanguage(lang: any) {
    this.selectedLanguage = lang;
    this.translocoService.setActiveLang(lang.code);
    this.StorageService.setItem('lang', lang.code);
    document.getElementsByTagName('html')[0].setAttribute('dir', lang.direction);
   }

  help(){
    // ContactUsComponent
    this.dialog.open(ContactUsComponent, {
      width: '500px',
      // height: '500px',
      data: {}
    });
  }
  collapse(){
    this.isCollapsed = !this.isCollapsed;
  }
}
