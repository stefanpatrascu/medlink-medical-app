import { Component, ViewChild } from '@angular/core';
import { AppointmentMenuActionsComponent } from '@shared/components/appointment-menu-actions/appointment-menu-actions.component';
import { ButtonModule } from 'primeng/button';
import { ExtractValuePipe } from '@shared/pipes/extract-value.pipe';
import { IsoDateToStringPipe } from '@shared/pipes/iso-date-to-string.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, FilterMetadata, MessageService, SharedModule, SortMeta } from 'primeng/api';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';
import { IFilter, IGenericGridApiRequest } from '@interfaces/grid/generic-grid-api-request.interface';
import { GridUtil } from '@utils/grid.util';
import { FieldTypeEnum } from '@enums/grid/field-type.enum';
import { IGenericColumnConfig } from '@interfaces/grid/generic-column-config.interface';
import { take, tap } from 'rxjs';
import { GenericApiResponse } from '@interfaces/grid/generic-grid-api-response.interface';
import { IUserGrid } from '@interfaces/users/users-grid.interface';
import { UserService } from '@services/user/user.service';
import { DropdownModule } from 'primeng/dropdown';
import { BooleanToStringPipe } from '@shared/pipes/boolean.pipe';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateUpdateUserComponent } from '@shared/dialogs/create-update-user/create-update-user.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConvertToLocalPipe } from '@shared/pipes/convert-to-local.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AppointmentMenuActionsComponent,
    BooleanToStringPipe,
    ButtonModule,
    ExtractValuePipe,
    IsoDateToStringPipe,
    ProgressSpinnerModule,
    SharedModule,
    TableModule,
    DropdownModule,
    ConfirmDialogModule,
    ConvertToLocalPipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [DialogService, ConfirmationService, MessageService]
})
export class UsersComponent {

  @ViewChild('table') table: Table | undefined;

  filterRequest: IGenericGridApiRequest | null = null;
  users: IUserGrid[] = [];
  pageSizes: number[] = GridUtil.getPageSizes();
  defaultPageSize: number = GridUtil.getDefaultPageSize();
  isLoading: boolean = false;
  selectedUserToManage: IUserGrid | null = null;
  totalRecords: number = 0;
  fieldType: typeof FieldTypeEnum = FieldTypeEnum;
  defaultSort: SortMeta[] = [];
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
      name: 'Full Name',
      fieldKey: 'fullName',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'fullName',
      filterKey: 'fullName',
      style: 'width: 200px'
    },
    {
      name: 'CNP',
      fieldKey: 'cnp',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'cnp',
      filterKey: 'cnp',
      style: 'width: 100px'
    },
    {
      name: 'Email',
      fieldKey: 'email',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'email',
      filterKey: 'email',
      style: 'width: 100px'
    },
    {
      name: 'Phone',
      fieldKey: 'phoneNumber',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'phoneNumber',
      filterKey: 'phoneNumber',
      style: 'width: 70px'
    },
    {
      name: 'Specialization',
      fieldKey: 'specialization',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'employee.specialization',
      filterKey: 'employee.specialization',
      style: 'width: 70px'
    },
    {
      name: 'Employee Type',
      fieldKey: 'employeeType',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'employee.employeeType',
      filterKey: 'employee.employeeType',
      style: 'width: 140px'
    },
    {
      name: 'Hire Date',
      fieldKey: 'hireDate',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'employee.hireDate',
      filterKey: 'employee.hireDate',
      style: 'width: 150px'
    },
    {
      name: 'Roles',
      fieldKey: 'roles',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'roles.role',
      filterKey: 'roles.role',
      style: 'width: 70px'
    },
    {
      name: 'Last Login',
      fieldKey: 'lastLogin',
      fieldType: FieldTypeEnum.DATE,
      sortKey: 'lastLogin',
      filterKey: 'lastLogin',
      style: 'width: 150px'
    },
    {
      name: 'Last Updated At',
      fieldKey: 'updatedAt',
      fieldType: FieldTypeEnum.DATE,
      sortKey: 'updatedAt',
      filterKey: 'updatedAt',
      style: 'width: 250px'
    },
    {
      name: 'Enabled',
      fieldKey: 'enabled',
      fieldType: FieldTypeEnum.BOOLEAN,
      sortKey: 'enabled',
      filterKey: 'enabled',
      style: 'width: 70px'
    }
  ]

  constructor(private userService: UserService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  openAddUserDialog(): void {
    this.dialogService.open(CreateUpdateUserComponent, {
      header: 'Create User',
      width: '1200px'
    }).onClose
    .pipe(
      take(1)
    )
    .subscribe((submitted) => {
      if (submitted) {
        this.reloadTable();
      }
    });
  }

  openEditUserDialog(user: IUserGrid): void {
    this.dialogService.open(CreateUpdateUserComponent, {
      header: 'Update User ' + user.fullName,
      width: '1200px',
      data: user
    }).onClose
    .pipe(
      take(1)
    ).subscribe((submitted) => {
      if (submitted) {
        this.reloadTable();
      }
    });
  }

  openDeleteUserDialog(user: IUserGrid): void {
    this.confirmationService.confirm({
      header: 'Are you sure you want to delete this user?',
      message: 'This action cannot be undone and can have side effects.',
      accept: (): void => {
        if (user.id) {
          this.userService.deleteUser(user.id)
          .pipe(
            take(1)
          ).subscribe(() => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'User deleted successfully'});
            this.reloadTable();
          });
        }
      },
      reject: (): void => {
      }
    });
  }

  reloadTable(): void {
    if (this.table) {
      this.onLazyLoad(this.table.createLazyLoadMetadata());
    }
  }

  async onLazyLoad(event: TableLazyLoadEvent): Promise<void> {
    setTimeout((): boolean => this.isLoading = true, 0); // TODO: This is to prevent ExpressionChangedAfterItHasBeenCheckedError. Find a better way to handle this.


    this.filterRequest = {
      page: GridUtil.getCurrentPage(event.first, event.rows),
      size: GridUtil.getPageSize(event.rows),
      sorts: GridUtil.formatSorts(event.multiSortMeta, this.columns),
      filters: await this.getFilterRequest(event)
    }
    this.userService.getAllUsers(this.filterRequest)
    .pipe(
      tap((): boolean => this.isLoading = false),
      take(1)
    )
    .subscribe((response: GenericApiResponse<IUserGrid>): void => {
      this.users = response.content;
      this.totalRecords = response.totalElements;
    });
  }

  async getFilterRequest(event: TableLazyLoadEvent): Promise<IFilter[]> {

    let filters: IFilter[] = [];

    filters = filters.concat(GridUtil.formatFilters(event.filters, this.columns));
    return filters;
  }
}
