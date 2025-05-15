import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolyclinicsComponent } from './polyclinics.component';

describe('PolyclinicsComponent', () => {
  let component: PolyclinicsComponent;
  let fixture: ComponentFixture<PolyclinicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolyclinicsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolyclinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
