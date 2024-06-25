import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointmentsCalendarComponent } from './doctor-appointments-calendar';
import { HttpClientModule } from '@angular/common/http';

describe('MyAppointmentsDoctorComponent', () => {
  let component: DoctorAppointmentsCalendarComponent;
  let fixture: ComponentFixture<DoctorAppointmentsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorAppointmentsCalendarComponent, HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAppointmentsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
