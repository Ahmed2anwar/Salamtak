import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindADoctorBySubSpecialtyComponent } from './find-a-doctor-by-sub-specialty.component';

describe('FindADoctorBySubSpecialtyComponent', () => {
  let component: FindADoctorBySubSpecialtyComponent;
  let fixture: ComponentFixture<FindADoctorBySubSpecialtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindADoctorBySubSpecialtyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindADoctorBySubSpecialtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
