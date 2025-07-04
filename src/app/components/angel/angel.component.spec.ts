import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngelComponent } from './angel.component';

describe('AngelComponent', () => {
  let component: AngelComponent;
  let fixture: ComponentFixture<AngelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AngelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
