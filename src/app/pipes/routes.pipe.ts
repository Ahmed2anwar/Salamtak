import { Pipe, PipeTransform } from '@angular/core';
import { routeName } from '../routes.lang';
import { TranslocoService } from '@jsverse/transloco';
import { LocalStorageService } from '../services/local-storage.service';

@Pipe({
  name: 'route',
  standalone: true,
  pure: false
})
export class RoutesPipe implements PipeTransform {
  private currentLang: string;

  constructor(
    private translocoService: TranslocoService,
    private storage : LocalStorageService
  ) {

    // Listen to language changes and update currentLang
    this.currentLang = this.translocoService.getActiveLang();
    this.translocoService.langChanges$.subscribe(lang => {
      this.currentLang = lang;

    });
  }

  transform(value: unknown, ...args: unknown[]): string {
    return '/' + routeName(value, (args[0] || this.currentLang));
  }
}
