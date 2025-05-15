import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    NgxSpinnerModule,
    RoutesPipe
  ],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss'
})
export class OfferComponent {
  offers:any;
  offerCategory:any;
  storageUrl = environment.storageUrl;
  lang :any = this.translocoService.getActiveLang();
  images = [
    'assets/background/ads.jpeg',
    'assets/background/ads.jpeg',
    'assets/background/ads.jpeg',
    'assets/background/ads.jpeg',
    'assets/background/ads.jpeg',
    'assets/background/ads.jpeg',
  ];

  constructor(
    private service : AppService ,    private spinner: NgxSpinnerService,
    private metadataService : MetadataService,
    private patientService: AppService,private translocoService: TranslocoService, private router: Router,private route: ActivatedRoute,
    private routesPipe: RoutesPipe
  ) { }

  ngOnInit() {
    this.metadataService.updateMetadata('offer');
    this.lang= this.translocoService.getActiveLang()
    this.offerCategory = parseInt(this.route.snapshot.params['offerId']);
    this.getOfferByCategory()
    console.log(this.offers);

  }
  getOfferByCategory(){
    this.spinner.show(); // Show the spinner
    this.patientService.gerOffersByCategory(this.offerCategory).subscribe((res:any)=>{
      this.offers=res['Data']
      this.spinner.hide()
    console.log(this.offers);

    })
  }
  onBookNow(offerId: number): void {
    const selectedOffer = this.offers.find((offer:any) => offer.Id === offerId);
    if (selectedOffer) {
      this.patientService.setSelectedOffer(selectedOffer);
      // this.router.navigate([`/${this.lang}/bookOffer/${offerId}`]);
      this.router.navigate([this.routesPipe.transform('bookOffer',offerId)]);
    }
  }
}

