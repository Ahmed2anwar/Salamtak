import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-salamtakcap',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    FormsModule,
    RoutesPipe,
  ],
  templateUrl: './salamtakcap.component.html',
  styleUrl: './salamtakcap.component.scss',
})
export class SalamtakcapComponent {
  id: any;
  public blogs: any[] = [];
  showmore = false;
  btnText = 'Show More';
  scr: any = 'https://';
  url: any;

  storageUrl = environment.storageUrl;
  constructor(
    private spinner: NgxSpinnerService,
    private patientService: AppService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private metadataService: MetadataService,
    public routesPipe: RoutesPipe
  ) {}
  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    this.metadataService.updateMetadata('salamtakcap');

    this.id = parseInt(this.route.snapshot.params['id']);
    this.getBlogs();
    self.addEventListener('fetch', (event: any) => {
      event.respondWith(
        (async function () {
          // Use the navigation preload module if it's supported
          if (event.preloadResponse) {
            // Ensure that the preload response is settled before responding
            event.waitUntil(
              (async function () {
                const preloadResponse = await event.preloadResponse;
                // You can perform additional tasks with preloadResponse if needed
              })()
            );
            return event.preloadResponse;
          }

          // Your regular fetch handling logic goes here
          const response = await fetch(event.request);
          return response;
        })()
      );
    });
  }

  getBlogs() {
    this.spinner.show();
    this.patientService.getBlogss(4).subscribe((res: any) => {
      this.blogs = res['Data'];
      // this.blogs.forEach(element => {
      //   element.image=
      //   this.sanitizer.bypassSecurityTrustHtml
      //       (element.image);
      //   this.url =element.image;

      // });
      this.blogs.forEach((element) => {
        this.url = this.getSafeUrl(element.image);
      });
      this.spinner.hide();
    });
  }
  showAllDesc(i: any) {
    if (this.showmore) this.btnText = 'Show More';
    else this.btnText = 'Show Less';
    this.showmore = !this.showmore;
  }
}
