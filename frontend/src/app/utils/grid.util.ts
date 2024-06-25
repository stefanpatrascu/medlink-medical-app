import { FilterMetadata } from 'primeng/api/filtermetadata';
import { IGenericColumnConfig } from '../interfaces/grid/generic-column-config.interface';
import { IFilter, ISort } from '../interfaces/grid/generic-grid-api-request.interface';
import { LogicalOperatorEnum } from '../enums/grid/logical-operator.enum';
import { FilterOperatorEnum } from '../enums/grid/filter-operator.enum';
import { DateTime } from 'luxon';
import { DEFAULT_SERVER_DATE_FORMAT } from '../app.constants';
import { SortDirectionEnum } from '../enums/grid/sort-direction.enum';
import { FieldTypeEnum } from '../enums/grid/field-type.enum';

export class GridUtil {

  static getMatchModeMapping(matchMode: string | undefined): FilterOperatorEnum {
    switch (matchMode) {
      case 'contains':
        return FilterOperatorEnum.CONTAINS;
      case 'startsWith':
        return FilterOperatorEnum.STARTS_WITH;
      case 'endsWith':
        return FilterOperatorEnum.ENDS_WITH;
      case 'equals':
      case 'dateIs':
        return FilterOperatorEnum.EQUALS;
      case 'notEquals':
      case 'dateIsNot':
        return FilterOperatorEnum.NOT_EQUALS;
      case 'in':
        return FilterOperatorEnum.IN;
      case 'lt':
        return FilterOperatorEnum.LT;
      case 'lte':
        return FilterOperatorEnum.LTE;
      case 'gt':
        return FilterOperatorEnum.GT;
      case 'gte':
        return FilterOperatorEnum.GTE;
      case 'isNotNull':
        return FilterOperatorEnum.IS_NOT_NULL;
      case 'isNull':
        return FilterOperatorEnum.IS_NULL;
      case 'dateAfter':
        return FilterOperatorEnum.DATE_AFTER;
      case 'dateBefore':
        return FilterOperatorEnum.DATE_BEFORE;
      default:
        console.error('Match mode not found: ' + matchMode);
        return FilterOperatorEnum.EQUALS;
    }
  }

  static getDefaultPageSize(): number {
    return 25;
  }

  static getPageSizes(): number[] {
    return [25, 50, 100];
  }

  static getCurrentPage(first: number | undefined, rows: number | null | undefined): number {
    if (!first || !rows) {
      return 0;
    }
    return first / rows;
  }

  static getPageSize(pageSize: number | undefined | null): number {
    if (!pageSize) {
      return GridUtil.getPageSizes()[0];
    }
    return pageSize;
  }

  static formatSorts(primengSorts: any, columns: IGenericColumnConfig[]): ISort[] {
    const sorts: ISort[] = [];
    if (primengSorts) {
      for (const sort of primengSorts) {
        const column: IGenericColumnConfig | undefined = columns
        .find((c: IGenericColumnConfig): boolean => c.fieldKey === sort.field);
        if (column) {
          sorts.push({
            key: column.sortKey ?? column.fieldKey,
            order: sort.order === 1 ? SortDirectionEnum.ASC : SortDirectionEnum.DESC
          });
        }
      }
    }
    return sorts;
  }

  static formatFilters(primengFilters: FilterMetadata | FilterMetadata[] | any,
                       columns: IGenericColumnConfig[]): IFilter[] {
    const filters: IFilter[] = [];
    for (const key in primengFilters) {
      const column: IGenericColumnConfig | undefined = columns
      .find((c: IGenericColumnConfig): boolean => c.fieldKey === key);
      const filter: FilterMetadata = (primengFilters[key] as FilterMetadata[])[0];
      if (filter.value !== undefined && filter.value !== null && filter.value !== '') {

        if (column?.fieldType === FieldTypeEnum.DATE) {
          filters.push({
            operator: LogicalOperatorEnum[filter.operator?.toUpperCase() as keyof typeof LogicalOperatorEnum],
            matchMode: GridUtil.getMatchModeMapping(filter.matchMode),
            fieldType: column?.fieldType ?? FieldTypeEnum.STRING,
            key: column?.filterKey ?? key,
            value: DateTime.fromJSDate(filter.value).toFormat(DEFAULT_SERVER_DATE_FORMAT)
          });
        } else if (column?.fieldType === FieldTypeEnum.BOOLEAN) {
          filters.push({
            operator: LogicalOperatorEnum[filter.operator?.toUpperCase() as keyof typeof LogicalOperatorEnum],
            matchMode: FilterOperatorEnum.EQUALS,
            fieldType: column?.fieldType ?? FieldTypeEnum.STRING,
            key: column?.filterKey ?? key,
            value: String(filter.value)
          });
        } else {
          filters.push({
            operator: LogicalOperatorEnum[filter.operator?.toUpperCase() as keyof typeof LogicalOperatorEnum],
            matchMode: GridUtil.getMatchModeMapping(filter.matchMode),
            fieldType: column?.fieldType ?? FieldTypeEnum.STRING,
            key: column?.filterKey ?? key,
            value: filter.value
          });
        }
      }
    }
    return filters;
  }


}
