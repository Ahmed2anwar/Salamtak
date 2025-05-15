import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskesComponent } from './askes.component';

describe('AskesComponent', () => {
  let component: AskesComponent;
  let fixture: ComponentFixture<AskesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AskesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
