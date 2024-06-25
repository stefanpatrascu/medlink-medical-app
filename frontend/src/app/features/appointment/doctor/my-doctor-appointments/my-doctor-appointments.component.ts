import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { DoctorAppointmentsCalendarComponent } from '../doctor-appointments-calendar/doctor-appointments-calendar';
import { DoctorAppointmentsTableComponent } from '../doctor-appointments-table/doctor-appointments-table.component';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';
import { AppointmentsViewSwitcherEnum } from '@enums/appointments-view-switcher.enum';
import { CalendarViewEnum } from '@enums/calendar/calendar-view.enum';
import { RoutePathEnum } from '@enums/route-path.enum';
import { TitleService } from '@services/title.service';


@Component({
  selector: 'app-all-appointments',
  templateUrl: './my-doctor-appointments.component.html',
  styleUrl: './my-doctor-appointments.component.scss',
  standalone: true,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    DoctorAppointmentsCalendarComponent,
    DoctorAppointmentsTableComponent
  ]
})
export class MyDoctorAppointmentsComponent implements OnInit {
  pageTitle: string = 'My Appointments';
  selectedStatus: AppointmentStatusEnum | null = null;
  selectedView: AppointmentsViewSwitcherEnum = AppointmentsViewSwitcherEnum.TABLE;
  calendarSelectedView: CalendarViewEnum = CalendarViewEnum.WEEK;
  appointmentsViewSwitcherEnum = AppointmentsViewSwitcherEnum;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private title: TitleService
  ) {
  }

  ngOnInit() {
    this.onRouteChange();
  }

  onRouteChange() {
    this.route.children.find(child => child.outlet === 'primary')?.params?.subscribe((child: Params): void => {
      const status = child['status'];
      if ([RoutePathEnum.CANCELED, RoutePathEnum.COMPLETED, RoutePathEnum.CONFIRMED, RoutePathEnum.REQUESTED].indexOf(status) === -1) {
        this.router.navigate([RoutePathEnum.MY_DOCTOR_APPOINTMENTS], {relativeTo: this.route, replaceUrl: true});
      } else if (status) {
        this.selectedStatus = status.toUpperCase() as AppointmentStatusEnum;
      }
      this.title.updateTitle(this.pageTitle);
    });
  }

  changeView(view: AppointmentsViewSwitcherEnum): void {
    this.selectedView = view;
  }

}
