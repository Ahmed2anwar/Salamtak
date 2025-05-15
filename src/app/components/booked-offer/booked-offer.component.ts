import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BookofferformComponent } from '../../shared/bookofferform/bookofferform.component';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-booked-offer',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    BookofferformComponent
  ],
  templateUrl: './booked-offer.component.html',
  styleUrl: './booked-offer.component.scss'
})
export class BookedOfferComponent {
  HealthEntityId:any
  selectedOffer: any;
  offerId:any
  offerDetails=null
  storageUrl = environment.storageUrl;
  public IsEnglish = true;
  public IsArabic = false;
  constructor(
    private service : AppService ,    private spinner: NgxSpinnerService,
    private metadataService : MetadataService,
    private patientService: AppService,private translocoService: TranslocoService, private router: Router,private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.metadataService.updateMetadata('booked-offer');

    this.route.params.subscribe(params => {
      this.offerId = parseInt(params['offerId']);
      this.selectedOffer = this.patientService.getSelectedOffer();

    });
     this.service.getOfferDetailsByOfferId(this.offerId).subscribe((res:any) => {


      this.offerDetails=res.Data


    })
    const lang =this.translocoService.getActiveLang();
    if (lang) {
       if (lang === 'ar') {
       this.IsEnglish=false;
       this.IsArabic=true;
        // window.open('/termsAr')

      }
      else {
        this.IsEnglish=true;
        this.IsArabic=false;

      }

 }
  }

  onClinicImgError(event:any,name:any) {
    event.target.src =  'https://ui-avatars.com/api/?name=' + name + '&background=2B2979&color=fff&size=100';
  }
}
