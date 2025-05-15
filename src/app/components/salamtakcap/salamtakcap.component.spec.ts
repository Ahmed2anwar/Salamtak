import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalamtakcapComponent } from './salamtakcap.component';

describe('SalamtakcapComponent', () => {
  let component: SalamtakcapComponent;
  let fixture: ComponentFixture<SalamtakcapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalamtakcapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalamtakcapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
