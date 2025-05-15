/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LabServiceService } from './LabService.service';

describe('Service: LabService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LabServiceService]
    });
  });

  it('should ...', inject([LabServiceService], (service: LabServiceService) => {
    expect(service).toBeTruthy();
  }));
});
