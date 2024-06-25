import { FilterOperatorEnum } from '@enums/grid/filter-operator.enum';
import { LogicalOperatorEnum } from '@enums/grid/logical-operator.enum';
import { SortDirectionEnum } from '@enums/grid/sort-direction.enum';
import { FieldTypeEnum } from 'src/app/enums/grid/field-type.enum';

export interface IGenericGridApiRequest {
  page: number;
  size: number;
  sorts: ISort[];
  filters: IFilter[];
}

export interface IFilter {
  key: string;
  value: string;
  matchMode: FilterOperatorEnum;
  operator: LogicalOperatorEnum;
  fieldType: FieldTypeEnum;
}

export interface ISort {
  key: string;
  order: SortDirectionEnum;
}
