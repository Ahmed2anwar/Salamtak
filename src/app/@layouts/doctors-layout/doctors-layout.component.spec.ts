import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsLayoutComponent } from './doctors-layout.component';

describe('DoctorsLayoutComponent', () => {
  let component: DoctorsLayoutComponent;
  let fixture: ComponentFixture<DoctorsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
