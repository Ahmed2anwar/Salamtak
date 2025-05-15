import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, withFetch } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { MetadataService } from './services/metadata.service';
import { routes } from './app.routes';
import { RoutesPipe } from './pipes/routes.pipe';

export function initializeApp(metadataService: MetadataService) {
  return (): Promise<any> => {
    try {
      return metadataService.loadMetadata().toPromise();
    } catch (error) {
        return Promise.reject(error);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideHttpClient(
      withFetch()
    ),
    provideNativeDateAdapter(), // توفير المزود هنا
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // توفير اللغة المحلية إذا لزم الأمر
    
    provideTransloco({
        config: { 
          availableLangs: environment.languages,
          defaultLang: 'ar',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          // prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }),
       provideAnimationsAsync(),
      provideAnimations(
      ),
      importProvidersFrom(HttpClientModule),
      // provideHttpClient(withInterceptors([JwtInterceptor,ErrorInterceptor]))
      provideHttpClient(
        withFetch(),
        withInterceptors([JwtInterceptor, ErrorInterceptor]) 
      ),
      MetadataService,
      RoutesPipe,
      {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [MetadataService],
        multi: true
      }
      
    ]
};

