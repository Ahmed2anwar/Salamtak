import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsPrivacyPolicyComponent } from './doctors-privacy-policy.component';

describe('DoctorsPrivacyPolicyComponent', () => {
  let component: DoctorsPrivacyPolicyComponent;
  let fixture: ComponentFixture<DoctorsPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsPrivacyPolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorsPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
