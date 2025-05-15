import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSuccessfullyComponent } from './booking-successfully.component';

describe('BookingSuccessfullyComponent', () => {
  let component: BookingSuccessfullyComponent;
  let fixture: ComponentFixture<BookingSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSuccessfullyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
