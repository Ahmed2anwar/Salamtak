import { LocalStorageService } from './../../services/local-storage.service';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppService } from '../../services/app.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { log } from 'node:console';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [TranslocoModule, RouterModule, CommonModule],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss',
})
export class BlogDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private TranslocoService: TranslocoService,
    private LocalStorageService: LocalStorageService
  ) {}
  storageUrl = environment.storageUrl;
  blog: any = null;
  loading = false;
  error = '';
  ngOnInit(): void {
    const culture = this.TranslocoService.getActiveLang
      ? this.TranslocoService.getActiveLang()
      : 'en';
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Blog id is missing in the URL.';
      return;
    }

    this.loading = true;
    this.appService.getBlogById(id).subscribe({
      next: (res: any) => {
        this.blog = res?.Data ?? res;
        console.log(this.blog);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load blog details.';
        this.loading = false;
      },
    });
  }
}
