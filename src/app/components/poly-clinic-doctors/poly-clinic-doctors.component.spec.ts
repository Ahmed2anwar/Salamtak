import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolyClinicDoctorsComponent } from './poly-clinic-doctors.component';

describe('PolyClinicDoctorsComponent', () => {
  let component: PolyClinicDoctorsComponent;
  let fixture: ComponentFixture<PolyClinicDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolyClinicDoctorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolyClinicDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
