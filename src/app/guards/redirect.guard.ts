import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RedirectGuard {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const subSpecialty = route.paramMap.get('sub-specialty');
    const specialty = route.paramMap.get('specialty');
    if (
      subSpecialty &&
      specialty &&
      subSpecialty.toLowerCase() === specialty.toLowerCase()
    ) {

      return this.router.createUrlTree([`/${specialty}`]);
    }
    return true;
  }
}
