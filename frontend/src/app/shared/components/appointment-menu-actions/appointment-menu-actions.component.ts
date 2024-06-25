import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { IsoDateToStringPipe } from '../../pipes/iso-date-to-string.pipe';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem, SharedModule } from 'primeng/api';
import { IViewAppointmentAsDoctor } from 'src/app/interfaces/appointment/doctor-appointments.interface';
import { AppointmentStatusEnum } from '../../../enums/appointment-status.enum';
import { take } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ViewAppointmentDialogComponent } from 'src/app/features/appointment/view-appointment-dialog/view-appointment-dialog.component';


@Component({
  selector: 'app-appointment-menu-actions',
  standalone: true,
  imports: [
    IsoDateToStringPipe,
    MenuModule,
    SharedModule,
    ViewAppointmentDialogComponent
  ],
  templateUrl: './appointment-menu-actions.component.html',
  styleUrl: './appointment-menu-actions.component.scss'
})
export class AppointmentMenuActionsComponent implements OnChanges {
  @ViewChild('menu') menu: Menu | undefined;
  @Input() selectedAppointmentToManage: IViewAppointmentAsDoctor | null = null;
  @Output() shouldRefresh: EventEmitter<void> = new EventEmitter<void>();

  menuAppointment: MenuItem[] = [];

  constructor(private appointmentService: AppointmentService,
              private dialogService: DialogService) {
  }

  ngOnChanges(): void {
    this.menuAppointment = this.generateMenuAppointment();
  }

  generateMenuAppointment(): MenuItem[] {
    return [
      {
        label: 'View Appointment',
        icon: 'pi pi-pencil',
        iconClass: 'text-xl',
        command: (): void => {
          this.dialogService.open(ViewAppointmentDialogComponent, {
            header: 'Appointment #' + this.selectedAppointmentToManage?.id,
            width: '90%',
            contentStyle: {'max-height': '100%', 'overflow': 'auto'},
            data: {
              appointmentId: this.selectedAppointmentToManage?.id
            }
          }).onClose
          .pipe(
            take(1)
          )
          .subscribe((): void => this.shouldRefresh.emit());
        }
      },
      {
        label: 'Mark as Confirmed',
        icon: 'pi pi-check',
        iconClass: 'text-xl',
        visible: this.selectedAppointmentToManage?.status !== AppointmentStatusEnum.CONFIRMED,
        command: (): void => {
          this.changeAppointmentStatus(AppointmentStatusEnum.CONFIRMED)
        }
      },
      {
        label: 'Mark as Completed',
        icon: 'pi pi-check-square',
        iconClass: 'text-xl',
        visible: this.selectedAppointmentToManage?.status !== AppointmentStatusEnum.COMPLETED,
        command: (): void => {
          this.changeAppointmentStatus(AppointmentStatusEnum.COMPLETED)
        }
      },
      {
        label: 'Mark as Canceled',
        icon: 'pi pi-times',
        iconClass: 'text-xl',
        visible: this.selectedAppointmentToManage?.status !== AppointmentStatusEnum.CANCELED,
        command: (): void => this.changeAppointmentStatus(AppointmentStatusEnum.CANCELED)
      }
    ];
  }

  changeAppointmentStatus(status: AppointmentStatusEnum): void {
    this.appointmentService.updateAppointmentByDoctor(this.selectedAppointmentToManage?.id ?? 0, {status})
    .pipe(
      take(1)
    )
    .subscribe((): void => {
      this.shouldRefresh.emit();
    });
  }
}
