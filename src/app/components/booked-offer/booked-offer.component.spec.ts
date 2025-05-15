import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedOfferComponent } from './booked-offer.component';

describe('BookedOfferComponent', () => {
  let component: BookedOfferComponent;
  let fixture: ComponentFixture<BookedOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookedOfferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookedOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
