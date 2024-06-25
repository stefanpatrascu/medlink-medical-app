import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DateTime } from 'luxon';
import { take } from 'rxjs';
import { IViewAppointmentAsDoctor } from '../../../interfaces/appointment/doctor-appointments.interface';
import {
  AppointmentMenuActionsComponent
} from '../../components/appointment-menu-actions/appointment-menu-actions.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { IsoDateToStringPipe } from '../../pipes/iso-date-to-string.pipe';

@Component({
  selector: 'app-view-appointment-calendar-dialog',
  templateUrl: './view-appointments-calendar-dialog.component.html',
  styleUrl: './view-appointments-calendar-dialog.component.scss',
  standalone: true,
  imports: [
    AppointmentMenuActionsComponent,
    ButtonModule,
    CommonModule,
    IsoDateToStringPipe
  ]
})
export class ViewAppointmentsCalendarDialogComponent implements OnInit {

  @ViewChild('menuRef') menuRef: AppointmentMenuActionsComponent | undefined;
  appointments: IViewAppointmentAsDoctor[] = [];

  selectedAppointmentToManage: IViewAppointmentAsDoctor | null = null;

  ngOnInit(): void {
    this.populateAppointments();
  }

  constructor(private appointmentService: AppointmentService,
              private dialogConfig: DynamicDialogConfig
  ) {
  }

  get startInterval(): DateTime {
    return this.dialogConfig.data.dateTime.startOf('day');
  }

  get endInterval(): DateTime {
    return this.dialogConfig.data.dateTime.endOf('day');
  }

  toggleAppointmentMenu(event: Event, selectedAppointment: IViewAppointmentAsDoctor): void {
    this.selectedAppointmentToManage = selectedAppointment;
    this.menuRef?.menu?.toggle(event);
  }

  populateAppointments(): void {
    if (!this.dialogConfig.data || !this.dialogConfig.data.doctorId) {
      return;
    }
    this.appointmentService.getAllAppointmentsByDoctorAndInterval(this.dialogConfig.data.doctorId,
      this.startInterval, this.endInterval)
    .pipe(
      take(1)
    ).subscribe((appointments: IViewAppointmentAsDoctor[]): void => {
      this.appointments = appointments;
    });
  }

}
