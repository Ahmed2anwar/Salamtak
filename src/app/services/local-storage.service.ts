import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setItem(key: string, value: any, storageType: 'local' | 'session' = 'local'): void {
    if (this.isBrowser) {
      if (storageType === 'local') {
        localStorage.setItem(key, value);
      } else {
        sessionStorage.setItem(key, value);
      }
    }
  }

  getItem(key: string, storageType: 'local' | 'session' = 'local'): string | null {
    if (this.isBrowser) {
      return storageType === 'local' ? localStorage.getItem(key) : sessionStorage.getItem(key);
    }
    return null;
  }

  removeItem(key: string, storageType: 'local' | 'session' = 'local'): void {
    if (this.isBrowser) {
      if (storageType === 'local') {
        localStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
    }
  }

  clear(storageType: 'local' | 'session' = 'local'): void {
    if (this.isBrowser) {
      if (storageType === 'local') {
        localStorage.clear();
      } else {
        sessionStorage.clear();
      }
    }
  }
}
