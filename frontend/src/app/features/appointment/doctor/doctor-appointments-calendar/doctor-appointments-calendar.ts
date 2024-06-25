import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { take, tap } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { DateTime } from 'luxon';
import { IDoctor } from 'src/app/interfaces/users/doctor.interface';
import { UserService } from 'src/app/services/user/user.service';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { AccountService } from 'src/app/services/login/account.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { AppointmentMenuActionsComponent } from '@shared/components/appointment-menu-actions/appointment-menu-actions.component';
import { CalendarComponent } from '@shared/components/calendar/calendar.component';
import { IDoctorProgram } from '@interfaces/appointment/doctor-programs.interface';
import { IViewAppointmentAsDoctor } from '@interfaces/appointment/doctor-appointments.interface';
import { ICalendarEvent } from '@interfaces/calendar/calendar.interface';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';
import { ViewAppointmentsCalendarDialogComponent } from '@shared/dialogs/view-appointment-calendar-dialog/view-appointments-calendar-dialog.component';
import { IMyAccount } from '@interfaces/account/my-account.interface';
import { RolesEnum } from '@enums/roles.enum';
import { ICalendarInterval } from '@interfaces/calendar/month-interval.interface';
import { CreateUpdateAppointmentComponentDialogComponent } from '@shared/dialogs/create-update-appointment-dialog/create-update-appointment-component-dialog.component';

@Component({
  selector: 'app-doctor-appointments-calendar',
  templateUrl: './doctor-appointments-calendar.html',
  styleUrl: './doctor-appointments-calendar.scss',
  standalone: true,
  imports: [
    AppointmentMenuActionsComponent,
    CalendarComponent
  ],
  providers: [DialogService]
})
export class DoctorAppointmentsCalendarComponent implements OnInit {
  @ViewChild('menuRef') menuRef: AppointmentMenuActionsComponent | undefined;

  @Input() allowChangeInterval: boolean = true;
  @Input() selectedView: 'day' | 'week' | 'month' = 'month';
  @Input() allowChangeView: boolean = false;
  loading: boolean = false;
  selectedDoctor: number | null = null;
  selectedClinic: number | null = null;
  startDate: DateTime = DateTime.now().startOf('month');
  endDate: DateTime = DateTime.now().endOf('month');
  menuAppointment: MenuItem[] = [];
  doctorPrograms: IDoctorProgram[] = [];
  calendarDayInterval: { startTime: string; endTime: string } = {startTime: '00:00', endTime: '24:00'};

  constructor(private appointmentService: AppointmentService,
              private userService: UserService,
              private accountService: AccountService,
              private dialogService: DialogService) {
  }

  events: ICalendarEvent[] = [];
  selectedAppointmentToManage: IViewAppointmentAsDoctor | null = null;
  allAppointments: IViewAppointmentAsDoctor[] = [];


  changeAppointmentStatus(status: AppointmentStatusEnum): void {
    this.appointmentService.updateAppointmentByDoctor(this.selectedAppointmentToManage?.id ?? 0, {status})
    .pipe(
      take(1)
    )
    .subscribe((): void => {
      this.populateCalendar(this.startDate, this.endDate);
    });
  }

  onEventMenuClick(event: { event: Event, calendarEvent: ICalendarEvent }): void {
    this.selectedAppointmentToManage = this.allAppointments.find((appointment: IViewAppointmentAsDoctor): boolean => appointment.id === event.calendarEvent.id) || null;
    this.menuRef?.menu?.toggle(event.event);
  }


  onClickMonthDay(dateTime: DateTime): void {
    this.dialogService.open(ViewAppointmentsCalendarDialogComponent, {
      header: 'Appointments on ' + dateTime.toFormat('dd/MM/yyyy'),
      width: '700px',
      data: {
        dateTime: dateTime,
        doctorId: this.selectedDoctor
      }
    }).onClose
    .pipe(
      take(1)
    )
    .subscribe(() => {
      this.populateCalendar(this.startDate, this.endDate);
    });
  }

  getCurrentUser(): void {
    this.accountService.myAccount()
    .pipe(
      take(1)
    )
    .subscribe((response: IMyAccount): void => {
      if (response.roles.includes(RolesEnum.DOCTOR)) {
        // If the user is a doctor, select the doctor automatically
        this.selectedDoctor = response.id;

        this.userService.getDoctorById(this.selectedDoctor)
        .pipe(
          take(1)
        )
        .subscribe((doctor: IDoctor): void => {
          this.selectedClinic = doctor.clinic.id;
        });
      }
      this.populateCalendar(this.startDate, this.endDate);
      this.populateDoctorPrograms();
    });
  }

  onChangeDoctor(event: DropdownChangeEvent): void {
    this.doctorPrograms = [];
    this.selectedDoctor = event.value;
    this.populateCalendar(this.startDate, this.endDate);
    this.populateDoctorPrograms();
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  populateDoctorPrograms(): void {
    this.calendarDayInterval = {startTime: '00:00', endTime: '24:00'};
    this.appointmentService.getDoctorPrograms(this.selectedDoctor ?? 0)
    .pipe(
      take(1)
    )
    .subscribe((response) => {
      this.doctorPrograms = response;
      this.calendarDayInterval = this.minAndMaxTime();
    });
  }

  reloadCalendar(): void {
    this.populateCalendar(this.startDate, this.endDate);
  }

  minAndMaxTime(): { startTime: string, endTime: string } {
    let startTime: DateTime = DateTime.now().set({hour: 0, minute: 0});
    let endTime: DateTime = DateTime.now().set({hour: 0, minute: 0});
    const minEndTime: DateTime = DateTime.now().set({hour: 22, minute: 0});
    const minStartTime: DateTime = DateTime.now().set({hour: 7, minute: 0});
    for (const program of this.doctorPrograms) {
      if (DateTime.fromFormat(program.startTime, 'HH:mm') > startTime) {
        startTime = DateTime.fromFormat(program.startTime, 'HH:mm');
      }
      if (DateTime.fromFormat(program.endTime, 'HH:mm') > endTime) {
        endTime = DateTime.fromFormat(program.endTime, 'HH:mm');
      }

      if (endTime < minEndTime) {
        endTime = minEndTime;
      }

      if (startTime < minStartTime) {
        startTime = minStartTime;
      }
    }
    return {
      startTime: startTime.toFormat('HH:mm'),
      endTime: endTime.toFormat('HH:mm')
    }
  }

  onChangeInterval(intervals: ICalendarInterval): void {
    this.populateCalendar(intervals.startDate, intervals.endDate);
  }

  onWeekIntervalToAdd(weekInterval: ICalendarInterval): void {
    this.dialogService.open(CreateUpdateAppointmentComponentDialogComponent, {
      header: 'Create Appointment',
      width: '700px',
      data: {
        weekInterval: weekInterval,
        doctorId: this.selectedDoctor,
        clinicId: this.selectedClinic
      }
    }).onClose.subscribe(() => {
      this.populateCalendar(this.startDate, this.endDate);
    });
  }

  private populateCalendar(startDate: DateTime, endTime: DateTime): void {
    if (!this.selectedDoctor) {
      this.events = [];
      return;
    }

    this.loading = true;
    this.appointmentService.getAllAppointmentsByDoctorAndInterval(this.selectedDoctor, startDate, endTime)
    .pipe(
      take(1),
      tap(() => this.loading = false)
    ).subscribe((appointments: IViewAppointmentAsDoctor[]): void => {
      this.allAppointments = appointments;
      this.events = appointments.map((appointment: IViewAppointmentAsDoctor): ICalendarEvent => ({
        id: appointment.id,
        startDateTime: appointment.appointmentStartDate,
        endDateTime: appointment.appointmentEndDate,
        title: `${appointment.patient?.fullName}`,
        type: appointment.status,
        tooltip: `Appointment #${appointment.id}
        Patient: ${appointment.patient?.fullName}
        Status: ${appointment.status}
        Between ${DateTime.fromISO(appointment.appointmentStartDate).toFormat('HH:mm')} and ${DateTime.fromISO(appointment.appointmentEndDate).toFormat('HH:mm')}`
      }));
    });
  }
}
