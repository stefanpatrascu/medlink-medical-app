import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MyAppointmentsPatientComponent } from '@appointment-feature/patient/my-appointments-patient/my-appointments-patient.component';
import { DashboardUtil } from '@utils/dashboard.util';
import { RoutePathEnum } from '@enums/route-path.enum';
import { IMyAccount } from '@interfaces/account/my-account.interface';
import { AccountService } from '@services/login/account.service';


@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MyAppointmentsPatientComponent,
    ButtonModule
  ]
})
export class PatientDashboardComponent {
  pageTitle: string = DashboardUtil.generatePageTitleBasedTime();
  currentUser$: Observable<IMyAccount> = this.accountService.myAccount();

  constructor(private accountService: AccountService,
              private router: Router) {
  }

  viewAllAppointments(): void {
    this.router.navigate([RoutePathEnum.APPOINTMENTS, RoutePathEnum.MY_APPOINTMENTS]);
  }
}
