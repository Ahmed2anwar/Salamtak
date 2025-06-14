import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeComponent } from './scope.component';

describe('ScopeComponent', () => {
  let component: ScopeComponent;
  let fixture: ComponentFixture<ScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
