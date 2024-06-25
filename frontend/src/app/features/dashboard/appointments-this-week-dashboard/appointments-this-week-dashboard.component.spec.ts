import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsThisWeekDashboardComponent } from './appointments-this-week-dashboard.component';
import { HttpClientModule } from '@angular/common/http';

describe('MyAppointmentsThisWeekDashboardComponent', () => {
  let component: AppointmentsThisWeekDashboardComponent;
  let fixture: ComponentFixture<AppointmentsThisWeekDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppointmentsThisWeekDashboardComponent,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsThisWeekDashboardComponent);
    fixture.componentRef.setInput('cardTitle', 'test');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
