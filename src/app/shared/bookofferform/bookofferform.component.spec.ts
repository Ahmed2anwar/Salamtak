import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookofferformComponent } from './bookofferform.component';

describe('BookofferformComponent', () => {
  let component: BookofferformComponent;
  let fixture: ComponentFixture<BookofferformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookofferformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookofferformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
