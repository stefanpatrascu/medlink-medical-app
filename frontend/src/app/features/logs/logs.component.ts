import { Component } from '@angular/core';
import { BooleanToStringPipe } from '@shared/pipes/boolean.pipe';
import { ButtonModule } from 'primeng/button';
import { ConvertToLocalPipe } from '@shared/pipes/convert-to-local.pipe';
import { IsoDateToStringPipe } from '@shared/pipes/iso-date-to-string.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FilterMetadata, SortMeta } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { GridUtil } from '@utils/grid.util';
import { take, tap } from 'rxjs';
import { GenericApiResponse } from '@interfaces/grid/generic-grid-api-response.interface';
import { LogsService } from '@services/logs/logs.service';
import { IFilter, IGenericGridApiRequest } from '@interfaces/grid/generic-grid-api-request.interface';
import { FieldTypeEnum } from '@enums/grid/field-type.enum';
import { IGenericColumnConfig } from '@interfaces/grid/generic-column-config.interface';
import { ILog } from '@interfaces/logs/log.interface';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    BooleanToStringPipe,
    ButtonModule,
    ConvertToLocalPipe,
    IsoDateToStringPipe,
    ProgressSpinnerModule,
    TableModule
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  isLoading: boolean = false;
  totalRecords: number = 0;
  pageSizes: number[] = GridUtil.getPageSizes();
  defaultPageSize: number = GridUtil.getDefaultPageSize();
  logs: ILog[] = [];
  fieldType = FieldTypeEnum;
  defaultSort: SortMeta[] = [{
    field: 'createdAt',
    order: 0
  }];
  defaultFilters: { [s: string]: FilterMetadata | FilterMetadata[]; } = {};

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
      name: 'Action',
      fieldKey: 'action',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'action',
      filterKey: 'action',
      style: 'width: auto'
    },
    {
      name: 'Description',
      fieldKey: 'description',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'description',
      filterKey: 'description',
      style: 'width: auto'
    },
    {
      name: 'Ip',
      fieldKey: 'ip',
      fieldType: FieldTypeEnum.STRING,
      sortKey: 'ip',
      filterKey: 'ip',
      style: 'width: auto'
    },
    {
      name: 'Created At',
      fieldKey: 'createdAt',
      fieldType: FieldTypeEnum.DATE,
      sortKey: 'createdAt',
      filterKey: 'createdAt',
      style: 'width: auto'
    },
  ];

  filterRequest: IGenericGridApiRequest | null = null;

  constructor(
    private logsService: LogsService
  ) {
  }

  async getFilterRequest(event: TableLazyLoadEvent): Promise<IFilter[]> {

    let filters: IFilter[] = [];

    filters = filters.concat(GridUtil.formatFilters(event.filters, this.columns));
    return filters;
  }

  async onLazyLoad(event: TableLazyLoadEvent): Promise<void> {
    setTimeout((): boolean => this.isLoading = true, 0); // TODO: This is to prevent ExpressionChangedAfterItHasBeenCheckedError. Find a better way to handle this.


    this.filterRequest = {
      page: GridUtil.getCurrentPage(event.first, event.rows),
      size: GridUtil.getPageSize(event.rows),
      sorts: GridUtil.formatSorts(event.multiSortMeta, this.columns),
      filters: await this.getFilterRequest(event)
    }
    this.logsService.getAllLogs(this.filterRequest)
    .pipe(
      tap((): boolean => this.isLoading = false),
      take(1)
    )
    .subscribe((response: GenericApiResponse<ILog>): void => {
      this.logs = response.content;
      this.totalRecords = response.totalElements;
    });
  }

}
