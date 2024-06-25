import { Component, input, InputSignal, ViewChild } from '@angular/core';
import { take, tap } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { MenuItem, SortMeta } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { IsoDateToStringPipe } from '@shared/pipes/iso-date-to-string.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService } from 'primeng/dynamicdialog';
import { IMyAppointments } from '@interfaces/appointment/my-appointments.interface';
import { GridUtil } from '@utils/grid.util';
import { FieldTypeEnum } from '@enums/grid/field-type.enum';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';
import { AppointmentService } from '@services/appointment/appointment.service';
import { IViewAppointmentAsDoctor } from '@interfaces/appointment/doctor-appointments.interface';
import { ViewAppointmentDialogComponent } from '@appointment-feature/view-appointment-dialog/view-appointment-dialog.component';
import { IGenericColumnConfig } from '@interfaces/grid/generic-column-config.interface';
import { CreateAppointmentDialogComponent } from '@shared/dialogs/create-appointment-dialog/create-appointment-dialog.component';
import {
  RescheduleAppointmentDialogComponent
} from '@shared/dialogs/reschedule-appointment-dialog/reschedule-appointment-dialog.component';
import { GenericApiResponse } from '@interfaces/grid/generic-grid-api-response.interface';
import { DateTime } from 'luxon';
import { IFilter } from '@interfaces/grid/generic-grid-api-request.interface';
import { LogicalOperatorEnum } from '@enums/grid/logical-operator.enum';
import { FilterOperatorEnum } from '@enums/grid/filter-operator.enum';

@Component({
  selector: 'app-my-appointments-patient-view',
  templateUrl: './my-appointments-patient.component.html',
  styleUrls: ['./my-appointments-patient.component.scss'],
  host: {
    '[class.patient-container-view]': 'patientContainer()',
    '[class.patient-container-component]': '!patientContainer()'
  },
  standalone: true,
  imports: [
    TableModule,
    MenubarModule,
    ButtonModule,
    MenuModule,
    IsoDateToStringPipe,
    ProgressSpinnerModule
  ],
  providers: [
    DialogService
  ]
})
export class MyAppointmentsPatientComponent {

  @ViewChild('table') table: Table | undefined;
  @ViewChild('menu') menu: Menu | undefined;

  patientContainer: InputSignal<boolean> = input<boolean>(true);
  displayOnlyThisWeek: InputSignal<boolean> = input<boolean>(false);
  allowAddAppointment: InputSignal<boolean> = input<boolean>(true);
  displayPageTitle: InputSignal<boolean> = input<boolean>(true);

  appointments: IMyAppointments[] = [];
  pageSizes: number[] = GridUtil.getPageSizes();
  defaultPageSize: number = GridUtil.getDefaultPageSize();
  isLoading: boolean = false;
  selectedAppointmentToManage: IMyAppointments | null = null;
  totalRecords: number = 0;
  fieldType = FieldTypeEnum;
  multiSortMeta: SortMeta[] = [{
    field: 'appointmentStartDate',
    order: 1
  }];
  appointmentStatusEnum: typeof AppointmentStatusEnum = AppointmentStatusEnum;

  manageAppointmentMenu: MenuItem[] = [
    {
      label: 'Cancel',
      icon: 'pi pi-times',
      iconClass: 'text-xl',
      command: (): void => this.cancelAppointment()
    },
    {
      label: 'Reschedule',
      icon: 'pi pi-calendar',
      iconClass: 'text-xl',
      command: (): void => this.rescheduleAppointment()
    }
  ];
  columns: IGenericColumnConfig[] = [
    {
      name: 'Id',
      fieldKey: 'id',
      fieldType: FieldTypeEnum.LONG,
      sortKey: 'id',
      filterKey: 'id',
      style: 'width: 70px'
    },
    {
      name: 'Status',
      fieldType: FieldTypeEnum.STRING,
      fieldKey: 'status',
      sortKey: 'appointmentStatus',
      filterKey: 'appointmentStatus',
      style: null
    },
    {
      name: 'Clinic',
      fieldType: FieldTypeEnum.STRING,
      fieldKey: 'clinicName',
      sortKey: 'clinic.clinicName',
      filterKey: 'clinic.clinicName',
      style: null

    },
    {
      name: 'Doctor',
      fieldType: FieldTypeEnum.STRING,
      fieldKey: 'doctorFullName',
      sortKey: 'doctor.fullName',
      filterKey: 'doctor.fullName',
      style: null
    },
    {
      name: 'Appointment Date',
      fieldType: FieldTypeEnum.DATE,
      fieldKey: 'appointmentStartDate',
      sortKey: 'appointmentStartDate',
      filterKey: 'appointmentStartDate',
      style: null
    }
  ]

  constructor(private appointmentService: AppointmentService,
              private dialogService: DialogService
  ) {
  }

  openAppointment(appointment: IViewAppointmentAsDoctor) {
    this.dialogService.open(ViewAppointmentDialogComponent, {
      header: 'Appointment #' + appointment.id,
      width: '90%',
      contentStyle: {'max-height': '100%', 'overflow': 'auto'},
      data: {
        appointmentId: appointment.id
      }
    })
  }

  onFutureAppointmentsOnlyChange(): void {
    this.reloadTable();
  }

  reloadTable(): void {
    if (this.table) {
      this.onLazyLoad(this.table.createLazyLoadMetadata());
    }
  }

  toggleAppointmentMenu(event: Event, selectedAppointment: IMyAppointments): void {
    this.menu?.toggle(event);
    this.selectedAppointmentToManage = selectedAppointment;
  }

  openCreateAppointmentDialog(): void {
    this.dialogService.open(CreateAppointmentDialogComponent, {
      header: 'Create Appointment',
      width: '500px',
      contentStyle: {'max-height': '100%', 'overflow': 'auto'}
    })
    .onClose
    .pipe(
      take(1),
    )
    .subscribe((): void => this.reloadTable());
  }

  cancelAppointment(): void {
    this.appointmentService.cancelAppointment(this.selectedAppointmentToManage?.id ?? 0)
    .pipe(
      take(1)
    )
    .subscribe((): void => this.reloadTable());
  }

  rescheduleAppointment(): void {
    this.dialogService.open(RescheduleAppointmentDialogComponent, {
      header: 'Reschedule Appointment with ' + this.selectedAppointmentToManage?.doctorFullName,
      width: '500px',
      contentStyle: {'max-height': '100%', 'overflow': 'auto'},
      data: this.selectedAppointmentToManage
    }).onClose
    .pipe(
      take(1)
    )
    .subscribe((): void => this.reloadTable());
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    setTimeout((): boolean => this.isLoading = true, 0); // TODO: This is to prevent ExpressionChangedAfterItHasBeenCheckedError. Find a better way to handle this.
    this.appointmentService.getMyAppointments({
      page: GridUtil.getCurrentPage(event.first, event.rows),
      size: GridUtil.getPageSize(event.rows),
      sorts: GridUtil.formatSorts(event.multiSortMeta, this.columns),
      filters: this.getFilterRequest(event)
    })
    .pipe(
      tap((): boolean => this.isLoading = false),
      take(1)
    )
    .subscribe((response: GenericApiResponse<IMyAppointments>): void => {
      this.appointments = response.content;
      this.totalRecords = response.totalElements;
    });
  }

  private getFilterRequest(event: TableLazyLoadEvent): IFilter[] {
    const startOfWeek = DateTime.now().startOf('week').toISODate();
    const endOfWeek = DateTime.now().endOf('week').toISODate();
    const filters: IFilter[] = [];
    if (this.displayOnlyThisWeek()) {
      filters.push({
        operator: LogicalOperatorEnum.AND,
        matchMode: FilterOperatorEnum.DATE_AFTER,
        fieldType: FieldTypeEnum.DATE,
        key: 'appointmentStartDate',
        value: startOfWeek
      });
      filters.push({
        operator: LogicalOperatorEnum.AND,
        matchMode: FilterOperatorEnum.DATE_BEFORE,
        fieldType: FieldTypeEnum.DATE,
        key: 'appointmentStartDate',
        value: endOfWeek
      });
    }
    return GridUtil.formatFilters(event.filters, this.columns).concat(filters);
  }

}
