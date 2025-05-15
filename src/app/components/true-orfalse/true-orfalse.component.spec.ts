import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueOrfalseComponent } from './true-orfalse.component';

describe('TrueOrfalseComponent', () => {
  let component: TrueOrfalseComponent;
  let fixture: ComponentFixture<TrueOrfalseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrueOrfalseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrueOrfalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
