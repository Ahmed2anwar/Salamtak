import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../environments/environment';
import { LocalStorageService } from '../services/local-storage.service';
import { TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { DocumentService } from '../services/document.service';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
    const authenticationService = inject(AuthenticationService);
    const transloco = inject(TranslocoService);
    const Document = inject(DocumentService)
    const currentUser = authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser['Token'];
    const isApiUrl = req.url.startsWith(environment.apiUrl);
    // http://localhost:4200/ar/home

    const dl = Document.getDocumentLanguage()
    // const lang = url.split('/')[1];


    const lang = req.url.includes('{lang}') ? dl : 'ar'
  




    if (req.url.includes('{lang}')) {
      req = req.clone({
        url: req.url.replace('{lang}', lang)
      });
    }
  
    if (isLoggedIn && isApiUrl) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.Token}`
        }
      });
    }
  
    return next(req);
  };
  