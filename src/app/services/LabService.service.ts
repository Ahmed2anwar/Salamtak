import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LabServiceService {

  private selectedLabId: number | null = null;

  setSelectedLabId(labId: number): void {
    this.selectedLabId = labId;
  }

  getSelectedLabId(): number | null {
    return this.selectedLabId;
  }

}
