import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyCenterComponent } from './radiology-center.component';

describe('RadiologyCenterComponent', () => {
  let component: RadiologyCenterComponent;
  let fixture: ComponentFixture<RadiologyCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyCenterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiologyCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
