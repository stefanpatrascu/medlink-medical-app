import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { RoutePathEnum } from 'src/app/enums/route-path.enum';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ButtonModule } from 'primeng/button';
import { CalendarViewEnum } from '@enums/calendar/calendar-view.enum';
import { DoctorAppointmentsCalendarComponent } from '../doctor-appointments-calendar/doctor-appointments-calendar';
import { DoctorAppointmentsTableComponent } from '../doctor-appointments-table/doctor-appointments-table.component';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';
import { AppointmentsViewSwitcherEnum } from '@enums/appointments-view-switcher.enum';
import { TitleService } from '@services/title.service';


@Component({
  selector: 'app-all-appointments',
  templateUrl: './all-appointments.component.html',
  styleUrl: './all-appointments.component.scss',
  imports: [
    TableModule,
    ButtonGroupModule,
    ButtonModule,
    DoctorAppointmentsCalendarComponent,
    DoctorAppointmentsTableComponent
  ],
  standalone: true
})
export class AllAppointmentsComponent implements OnInit {
  pageTitle: string = 'All Appointments';
  calendarSelectedView: CalendarViewEnum = CalendarViewEnum.WEEK;
  selectedStatus: AppointmentStatusEnum | null = null;
  selectedView: AppointmentsViewSwitcherEnum = AppointmentsViewSwitcherEnum.TABLE;
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
        return;
      } else if (status) {
        this.selectedStatus = status.toUpperCase() as AppointmentStatusEnum;
        this.pageTitle = status.charAt(0).toUpperCase() + status.slice(1) + ' Appointments';
        this.title.updateTitle(this.pageTitle);
      }
    });
  }

  changeView(view: AppointmentsViewSwitcherEnum): void {
    this.selectedView = view;
  }

}
