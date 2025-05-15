import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByDoctorComponent } from './search-by-doctor.component';

describe('SearchByDoctorComponent', () => {
  let component: SearchByDoctorComponent;
  let fixture: ComponentFixture<SearchByDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchByDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
