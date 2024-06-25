import { Component, Input, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { FilterMetadata, SortMeta } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom, take, tap } from 'rxjs';
import { DateTime } from 'luxon';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpResponse } from '@angular/common/http';
import { AppointmentMenuActionsComponent } from '@shared/components/appointment-menu-actions/appointment-menu-actions.component';
import { IsoDateToStringPipe } from '@shared/pipes/iso-date-to-string.pipe';
import { ViewAppointmentDialogComponent } from '@appointment-feature/view-appointment-dialog/view-appointment-dialog.component';
import { ExtractValuePipe } from '@shared/pipes/extract-value.pipe';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';
import { IFilter, IGenericGridApiRequest } from '@interfaces/grid/generic-grid-api-request.interface';
import { IViewAppointmentAsDoctor } from '@interfaces/appointment/doctor-appointments.interface';
import { GridUtil } from '@utils/grid.util';
import { FieldTypeEnum } from '@enums/grid/field-type.enum';
import { IGenericColumnConfig } from '@interfaces/grid/generic-column-config.interface';
import { AppointmentService } from '@services/appointment/appointment.service';
import { SaveFileService } from '@services/save-file/save-file.service';
import { AccountService } from '@services/login/account.service';
import { GenericApiResponse } from '@interfaces/grid/generic-grid-api-response.interface';
import { IMyAccount } from '@interfaces/account/my-account.interface';
import { FilterOperatorEnum } from '@enums/grid/filter-operator.enum';
import { LogicalOperatorEnum } from '@enums/grid/logical-operator.enum';
import { DEFAULT_SERVER_DATE_FORMAT } from 'src/app/app.constants';
import { ConvertToLocalPipe } from '@shared/pipes/convert-to-local.pipe';

@UntilDestroy()
@Component({
  selector: 'app-doctor-appointments-table',
  templateUrl: './doctor-appointments-table.component.html',
  styleUrl: './doctor-appointments-table.component.scss',
  imports: [
    AppointmentMenuActionsComponent,
    ButtonModule,
    IsoDateToStringPipe,
    ProgressSpinnerModule,
    ViewAppointmentDialogComponent,
    TableModule,
    ExtractValuePipe,
    ConvertToLocalPipe
  ],
  standalone: true,
  providers: [DialogService]
})
export class DoctorAppointmentsTableComponent {

  @ViewChild('table') table: Table | undefined;
  @ViewChild('menuRef') menuRef: AppointmentMenuActionsComponent | undefined;
  @Input() displayOnlyThisWeek: boolean = false;
  @Input() displayOnlyMyAppointments: boolean = true;
  @Input() selectedStatus: AppointmentStatusEnum | null = null;
  @Input() selectedPatientId: number | null = null;
  @Input() selectedHiddenIds: number[] = []

  filterRequest: IGenericGridApiRequest | null = null;
  appointments: IViewAppointmentAsDoctor[] = [];
  pageSizes: number[] = GridUtil.getPageSizes();
  defaultPageSize: number = GridUtil.getDefaultPageSize();
  isLoading: boolean = false;
  isExporting: boolean = false;
  selectedAppointmentToManage: IViewAppointmentAsDoctor | null = null;

  totalRecords: number = 0;
  fieldType = FieldTypeEnum;
  defaultSort: SortMeta[] = [{
    field: 'appointmentStartDate',
    order: 1
  }];
  defaultFilters: { [s: string]: FilterMetadata | FilterMetadata[]; } = {};

  appointmentStatusEnum: typeof AppointmentStatusEnum = AppointmentStatusEnum;

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
      fieldKey: 'clinic.name',
      sortKey: 'clinic.clinicName',
      filterKey: 'clinic.clinicName',
      style: null
    },
    {
      name: 'Doctor',
      fieldType: FieldTypeEnum.STRING,
      fieldKey: 'doctor.fullName',
      sortKey: 'doctor.fullName',
      filterKey: 'doctor.fullName',
      style: null
    },
    {
      name: 'Patient',
      fieldType: FieldTypeEnum.STRING,
      fieldKey: 'patient.fullName',
      sortKey: 'patient.fullName',
      filterKey: 'patient.fullName',
      style: null
    },
    {
      name: 'CNP',
      fieldType: FieldTypeEnum.STRING,
      fieldKey: 'patient.cnp',
      sortKey: 'patient.cnp',
      filterKey: 'patient.cnp',
      style: null
    },
    {
      name: 'Phone Number',
      fieldType: FieldTypeEnum.STRING,
      fieldKey: 'patient.phoneNumber',
      sortKey: 'patient.phoneNumber',
      filterKey: 'patient.phoneNumber',
      style: null
    },
    {
      name: 'Appointment Date',
      fieldType: FieldTypeEnum.DATE,
      fieldKey: 'appointmentStartDate',
      sortKey: 'appointmentStartDate',
      filterKey: 'appointmentStartDate',
      style: null
    },
    {
      name: 'Last Updated By',
      fieldType: FieldTypeEnum.STRING,
      filterKey: 'lastUpdatedBy',
      sortKey: 'lastUpdatedBy',
      fieldKey: 'lastUpdatedBy',
      style: 'width: 200px'
    },
    {
      name: 'Last Updated At',
      fieldType: FieldTypeEnum.DATE,
      filterKey: 'lastUpdatedDate',
      sortKey: 'lastUpdatedDate',
      fieldKey: 'lastUpdatedAt',
      style: 'width: 200px'
    }
  ]

  constructor(private appointmentService: AppointmentService,
              private saveFile: SaveFileService,
              private accountService: AccountService) {
  }

  changeAppointmentStatus(status: AppointmentStatusEnum): void {
    this.appointmentService.updateAppointmentByDoctor(this.selectedAppointmentToManage?.id ?? 0, {status})
    .pipe(
      take(1)
    )
    .subscribe((): void => this.reloadTable());
  }

  reloadTable(): void {
    if (this.table) {
      this.onLazyLoad(this.table.createLazyLoadMetadata());
    }
  }

  toggleAppointmentMenu(event: Event, selectedAppointment: IViewAppointmentAsDoctor): void {
    this.selectedAppointmentToManage = selectedAppointment;
    this.menuRef?.menu?.toggle(event);
  }


  exportExcel(): void {
    if (!this.filterRequest) {
      return;
    }

    this.isExporting = true;
    this.appointmentService.exportAppointments(this.filterRequest)
    .subscribe((response: HttpResponse<Blob>): void => {
      this.saveFile.saveFile(response);
      this.isExporting = false;
    });
  }

  async onLazyLoad(event: TableLazyLoadEvent): Promise<void> {
    setTimeout((): boolean => this.isLoading = true, 0); // TODO: This is to prevent ExpressionChangedAfterItHasBeenCheckedError. Find a better way to handle this.


    this.filterRequest = {
      page: GridUtil.getCurrentPage(event.first, event.rows),
      size: GridUtil.getPageSize(event.rows),
      sorts: GridUtil.formatSorts(event.multiSortMeta, this.columns),
      filters: await this.getFilterRequest(event)
    }
    this.appointmentService.getDoctorAppointments(this.filterRequest)
    .pipe(
      tap((): boolean => this.isLoading = false),
      take(1)
    )
    .subscribe((response: GenericApiResponse<IViewAppointmentAsDoctor>): void => {
      this.appointments = response.content;
      this.totalRecords = response.totalElements;
    });
  }

  async getFilterRequest(event: TableLazyLoadEvent): Promise<IFilter[]> {

    const currentUser: IMyAccount = await lastValueFrom(this.accountService.myAccount());

    let filters: IFilter[] = [];

    if (this.selectedStatus) {
      filters.push({
        fieldType: FieldTypeEnum.STRING,
        key: 'appointmentStatus',
        matchMode: FilterOperatorEnum.EQUALS,
        operator: LogicalOperatorEnum.AND,
        value: this.selectedStatus
      });
    }

    if (this.selectedHiddenIds.length > 0) {
      for (const id of this.selectedHiddenIds) {
        filters.push({
          fieldType: FieldTypeEnum.LONG,
          key: 'id',
          matchMode: FilterOperatorEnum.NOT_EQUALS,
          operator: LogicalOperatorEnum.AND,
          value: id.toString()
        });
      }
    }

    if (this.selectedPatientId) {
      filters.push({
        fieldType: FieldTypeEnum.LONG,
        key: 'patient.id',
        matchMode: FilterOperatorEnum.EQUALS,
        operator: LogicalOperatorEnum.AND,
        value: this.selectedPatientId.toString()
      });
    }

    if (this.displayOnlyMyAppointments) {
      filters.push({
        fieldType: FieldTypeEnum.LONG,
        key: 'doctor.id',
        matchMode: FilterOperatorEnum.EQUALS,
        operator: LogicalOperatorEnum.AND,
        value: currentUser.id.toString()
      });
    }

    if (this.displayOnlyThisWeek) {
      filters.push({
        fieldType: FieldTypeEnum.DATE,
        key: 'appointmentStartDate',
        matchMode: FilterOperatorEnum.DATE_AFTER,
        operator: LogicalOperatorEnum.AND,
        value: DateTime.now().startOf('week').toFormat(DEFAULT_SERVER_DATE_FORMAT)
      });
      filters.push({
        fieldType: FieldTypeEnum.DATE,
        key: 'appointmentEndDate',
        matchMode: FilterOperatorEnum.DATE_BEFORE,
        operator: LogicalOperatorEnum.AND,
        value: DateTime.now().endOf('week').toFormat(DEFAULT_SERVER_DATE_FORMAT)
      });
    }
    filters = filters.concat(GridUtil.formatFilters(event.filters, this.columns));
    return filters;
  }
}
