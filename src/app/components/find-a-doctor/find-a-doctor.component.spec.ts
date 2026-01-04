import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindADoctorComponent } from './find-a-doctor.component';

describe('FindADoctorComponent', () => {
  let component: FindADoctorComponent;
  let fixture: ComponentFixture<FindADoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindADoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindADoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
