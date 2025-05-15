import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingLayoutComponent } from './listing-layout.component';

describe('ListingLayoutComponent', () => {
  let component: ListingLayoutComponent;
  let fixture: ComponentFixture<ListingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
