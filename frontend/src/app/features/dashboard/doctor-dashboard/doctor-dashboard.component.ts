import { Component, OnInit } from '@angular/core';
import { AppointmentStatusEnum } from 'src/app/enums/appointment-status.enum';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import {
  AppointmentsThisWeekDashboardComponent
} from '../appointments-this-week-dashboard/appointments-this-week-dashboard.component';
import { DashboardUtil } from '../../../utils/dashboard.util';
import { DashboardCardComponent } from '@dashboard-feature/dashboard-card/dashboard-card.component';
import { IMyAccount } from '@interfaces/account/my-account.interface';
import { AppointmentService } from '@services/appointment/appointment.service';
import { AccountService } from '@services/login/account.service';
import { RoutePathEnum } from '@enums/route-path.enum';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
  standalone: true,
  imports: [
    DashboardCardComponent,
    AsyncPipe,
    AppointmentsThisWeekDashboardComponent
  ]
})
export class DoctorDashboardComponent implements OnInit {

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

  #populateStatistics(): void {
    this.appointmentsService.countByDoctor()
    .pipe(
      take(1)
    )
    .subscribe((appointments: Record<AppointmentStatusEnum, number>): void => {
      this.countAppointments = appointments;
    });
  }

  navigateToAppointments(key: AppointmentStatusEnum): void {
    this.router.navigate([RoutePathEnum.APPOINTMENTS, RoutePathEnum.MY_DOCTOR_APPOINTMENTS, key.toLowerCase()]);
  }

}
