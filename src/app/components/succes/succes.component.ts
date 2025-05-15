import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { MatBottomSheetModule, MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { languages } from '../../languages';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-succes',
  standalone: true,
  imports: [
    MatBottomSheetModule,
    MatMenuModule,
    TranslocoModule,
    RouterModule,
    CommonModule,
    RoutesPipe
  ],
  templateUrl: './succes.component.html',
  styleUrl: './succes.component.scss'
})
export class SuccesComponent {
  languages = languages;
  selectedLanguage = this.languages[0];
   isCollapsed = false;
  public IsEnglish=false;
  public IsArabic=true;
  flag:any
username:any;
  // user :any= null
  public user : any = null;
  lang :any = this.translocoService.getActiveLang()
  constructor(
    private StorageService : LocalStorageService,
    private metadataService : MetadataService,
    private authentication:AuthenticationService,private _bottomSheet: MatBottomSheet,private translocoService: TranslocoService) {
    this.authentication.currentUser.subscribe(currentUserSubject => {
      this.user = currentUserSubject;
 
    })
   }

   ngOnInit(): void {
    this.metadataService.updateMetadata('succes');

    const form :any = this.StorageService.getItem('sign-up-first-step');
    var date=JSON.parse(form);

    const lang = this.translocoService.getActiveLang();

    
      if (lang) {
         if (lang === 'ar') {
         this.IsEnglish=false;
         this.IsArabic=true;
         this.username=date.FullNameAr



          // window.open('/termsAr')

        }
        else {
          this.IsEnglish=true;
          this.IsArabic=false;
          this.username=date.FullNameEn



        }
        let Selected_lang =  this.languages.find((t:any)=>t.code ===lang);


        this.selectedLanguage = Selected_lang;
        this.translocoService.setActiveLang(Selected_lang.code);
        this.translocoService.setActiveLang(Selected_lang.code);
        this.StorageService.setItem('lang', Selected_lang.code);
        
        document.getElementsByTagName('html')[0].setAttribute('dir', Selected_lang.direction);
        this.flag=Selected_lang.flag
     
   }



  
    // this.image=this.user.extra.Image
}

}
