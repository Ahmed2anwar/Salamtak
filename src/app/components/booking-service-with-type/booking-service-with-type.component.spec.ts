import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingServiceWithTypeComponent } from './booking-service-with-type.component';

describe('BookingServiceWithTypeComponent', () => {
  let component: BookingServiceWithTypeComponent;
  let fixture: ComponentFixture<BookingServiceWithTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingServiceWithTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingServiceWithTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
