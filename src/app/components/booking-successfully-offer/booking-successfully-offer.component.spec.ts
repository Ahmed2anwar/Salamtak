import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSuccessfullyOfferComponent } from './booking-successfully-offer.component';

describe('BookingSuccessfullyOfferComponent', () => {
  let component: BookingSuccessfullyOfferComponent;
  let fixture: ComponentFixture<BookingSuccessfullyOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSuccessfullyOfferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingSuccessfullyOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
