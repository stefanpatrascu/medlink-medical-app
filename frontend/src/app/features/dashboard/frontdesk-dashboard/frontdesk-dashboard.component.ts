import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardCardComponent } from '@dashboard-feature/dashboard-card/dashboard-card.component';
import { AppointmentsThisWeekDashboardComponent } from '@dashboard-feature/appointments-this-week-dashboard/appointments-this-week-dashboard.component';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';
import { DashboardUtil } from '@utils/dashboard.util';
import { IMyAccount } from '@interfaces/account/my-account.interface';
import { AppointmentService } from '@services/appointment/appointment.service';
import { AccountService } from '@services/login/account.service';
import { RoutePathEnum } from '@enums/route-path.enum';


@Component({
  selector: 'app-frontdesk-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    DashboardCardComponent,
    AppointmentsThisWeekDashboardComponent
  ],
  templateUrl: './frontdesk-dashboard.component.html',
  styleUrl: './frontdesk-dashboard.component.scss'
})
export class FrontdeskDashboardComponent implements OnInit {

  countAppointments: Record<AppointmentStatusEnum, number> | null = null;
  pageTitle: string = DashboardUtil.generatePageTitleBasedTime();
  currentUser$: Observable<IMyAccount> = this.accountService.myAccount();

  statusesToDisplay: { key: AppointmentStatusEnum, label: string; icon: string; }[] = [
    {
      key: AppointmentStatusEnum.REQUESTED,
      label: 'Requested',
      icon: 'icon icon-requested'
    },
    {
      key: AppointmentStatusEnum.CONFIRMED,
      label: 'Confirmed',
      icon: 'icon icon-confirmed'
    },
    {
      key: AppointmentStatusEnum.COMPLETED,
      label: 'Completed',
      icon: 'icon icon-completed'
    },
    {
      key: AppointmentStatusEnum.CANCELED,
      label: 'Canceled',
      icon: 'icon icon-canceled'
    }];

  constructor(private router: Router,
              private appointmentsService: AppointmentService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.#populateStatistics();
  }

  navigateToAppointments(key: AppointmentStatusEnum): void {
    this.router.navigate([RoutePathEnum.APPOINTMENTS, RoutePathEnum.ALL_APPOINTMENTS, key.toLowerCase()]);
  }

  #populateStatistics(): void {
    this.appointmentsService.countAll()
    .pipe(
      take(1)
    )
    .subscribe((appointments: Record<AppointmentStatusEnum, number>): void => {
      this.countAppointments = appointments;
    });
  }

}
