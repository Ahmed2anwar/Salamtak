import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TranslocoService } from '@jsverse/transloco';
import { languages } from '../../languages';
import { MatListModule } from '@angular/material/list';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { Router } from '@angular/router';
import { routesKeys } from '../../routes.lang';

@Component({
  selector: 'app-change-language',
  standalone: true,
  imports: [MatListModule, CommonModule],
  templateUrl: './change-language.component.html',
  styleUrl: './change-language.component.scss',
})
export class ChangeLanguageComponent {
  languages = languages;
  isBrowser: boolean = false;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ChangeLanguageComponent>,
    private translocoService: TranslocoService,
    private storageService: LocalStorageService,
    private routesPipe: RoutesPipe,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  private normalize(seg: string): string {
    if (!seg && seg !== '') return seg;
    try {
      return decodeURIComponent(String(seg)).trim();
    } catch {
      return String(seg).trim();
    }
  }
  private getTranslatedSegment(segment: string, targetLang: string): string {
    const raw = this.normalize(segment);
    if (!routesKeys || typeof routesKeys !== 'object') {
      return raw;
    }
    for (const key in routesKeys) {
      if (!Object.prototype.hasOwnProperty.call(routesKeys, key)) continue;
      const entry: any = (routesKeys as any)[key];
      if (!entry || typeof entry !== 'object') continue;
      const enPath = this.normalize((entry.en ?? '').split('/').pop());
      const arPath = this.normalize((entry.ar ?? '').split('/').pop());
      const frPath = this.normalize((entry.fr ?? '').split('/').pop());
      if (raw === enPath || raw === arPath || raw === frPath) {
        const targetVal = entry[targetLang];
        if (targetVal) {
          const translatedPath = this.normalize(String(targetVal).split('/').pop() ?? '');
          if (translatedPath) {
            return translatedPath;
          }
        }
        if (enPath) {
          return enPath;
        }
        return raw;
      }
    }
    for (const key in routesKeys) {
      if (!Object.prototype.hasOwnProperty.call(routesKeys, key)) continue;
      const entry: any = (routesKeys as any)[key];
      if (!entry || typeof entry !== 'object') continue;
      const fullEn = this.normalize(entry.en);
      const fullAr = this.normalize(entry.ar);
      if (raw === fullEn || raw === fullAr) {
        const targetVal = entry[targetLang];
        if (targetVal) {
          const translatedPath = this.normalize(String(targetVal).split('/').pop() ?? '');
          return translatedPath;
        }
        if (fullEn) return fullEn.split('/').pop() as string;
      }
    }
    return raw;
  }
  setLanguage(code: any) {
    const targetCode = typeof code === 'string' ? code : code?.code;
    if (!targetCode) return;
    this.storageService.setItem('lang', targetCode);
    try {
      const currentUrl = this.router.url || '/';
      const [pathPart, queryPart] = String(currentUrl).split('?');
      const segments = pathPart.split('/').filter(Boolean);
      const langCodes = ['en', 'ar', 'fr'];
      let pathSegments = segments;
      let hadLangPrefix = false;
      if (segments.length && langCodes.includes(segments[0])) {
        hadLangPrefix = true;
        pathSegments = segments.slice(1);
      }
      const mapped: string[] = pathSegments.map((seg, idx) => {
        if (/^\d+$/.test(seg) || seg.startsWith(':')) {
          return seg;
        }
        if (seg.includes('.') || seg.includes('=')) {
          return seg;
        }
        const translated = this.getTranslatedSegment(seg, targetCode);
        return translated;
      });
      const newPath = ['/', targetCode, ...mapped].join('/').replace(/\/+/g, '/');
      let finalUrl = newPath;
      if (queryPart) finalUrl = `${newPath}?${queryPart}`;
      const encodedUrl = encodeURI(finalUrl);
      this.router.navigateByUrl(encodedUrl, { replaceUrl: true }).then(() => {
        if (this.isBrowser) window.location.reload();
      }).catch((err) => {
        if (this.isBrowser) {
          this.router.navigateByUrl(`/${targetCode}`).then(() => window.location.reload());
        }
      });
    } catch (err) {
      console.error('setLanguage uncaught error:', err);
    }
  }

  getLanguage() {
    return this.translocoService.getActiveLang();
  }
}
