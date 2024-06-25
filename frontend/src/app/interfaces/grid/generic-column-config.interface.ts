import { FieldTypeEnum } from '@enums/grid/field-type.enum';

export interface IGenericColumnConfig {
  name: string;
  fieldKey: string;
  sortKey: string | null;
  fieldType: FieldTypeEnum;
  filterKey: string | null;
  style: string | null;
}


