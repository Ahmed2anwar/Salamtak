import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { DocumentService } from '../services/document.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard implements CanActivate {
  constructor(
    private translocoService: TranslocoService,
    private router: Router,
    private ds: DocumentService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const lang = route.paramMap.get('lang');
    if (lang === 'ar') {
      this.ds.setDocumentLanguage('ar');
    } else {
      this.ds.setDocumentLanguage('en');
    }
    if (lang === 'en' || lang === 'ar') {
      this.translocoService.setActiveLang(lang);
      return true;
    } else {
      return this.router.navigate(['/en']);
    }
  }
}
