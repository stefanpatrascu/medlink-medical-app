import { Component, input, InputSignal } from '@angular/core';
import {ButtonGroupModule} from 'primeng/buttongroup';
import {ButtonModule} from 'primeng/button';
import { DoctorAppointmentsCalendarComponent } from '@appointment-feature/doctor/doctor-appointments-calendar/doctor-appointments-calendar';
import { DoctorAppointmentsTableComponent } from '@appointment-feature/doctor/doctor-appointments-table/doctor-appointments-table.component';
import { AppointmentsViewSwitcherEnum } from '@enums/appointments-view-switcher.enum';
import { CalendarViewEnum } from '@enums/calendar/calendar-view.enum';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';

@Component({
  selector: 'app-my-appointments-this-week-dashboard',
  standalone: true,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    DoctorAppointmentsCalendarComponent,
    DoctorAppointmentsTableComponent
  ],
  templateUrl: './appointments-this-week-dashboard.component.html',
  styleUrl: './appointments-this-week-dashboard.component.scss'
})
export class AppointmentsThisWeekDashboardComponent {

  cardTitle: InputSignal<string> = input.required();
  allowSwitchView: InputSignal<boolean> = input(true);
  displayOnlyMyAppointments: InputSignal<boolean> = input(false);

  appointmentsViewSwitcherEnum = AppointmentsViewSwitcherEnum;
  selectedView: AppointmentsViewSwitcherEnum = AppointmentsViewSwitcherEnum.TABLE;
  calendarSelectedView: CalendarViewEnum = CalendarViewEnum.WEEK;
  selectedStatus: AppointmentStatusEnum | null = null;

  changeView(view: AppointmentsViewSwitcherEnum): void {
    this.selectedView = view;
  }

}
