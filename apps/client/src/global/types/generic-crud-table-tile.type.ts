import type {
  GenericDataType,
  TableInfoInterface,
} from '@/global/types/generic-table.types';
import Joi from 'joi';
import { FormFieldConfig } from '@/global/forms/types/generic-form.types';
import { CSSProperties } from 'react';

export type GenericCrudTableTileProps<
  TRecord extends GenericDataType,
  TForm extends { [key: string]: any },
> = {
  to: string;
  expanded: boolean;
  data: TRecord[];
  title: string;
  tableInfo: TableInfoInterface<TRecord>[];
  tableKey: string;
  bodyHeight: CSSProperties["height"]

  fields: FormFieldConfig<TForm>[];
  schema: Joi.ObjectSchema<any>;

  emptyMessage?: string;

  createInitialData: () => TForm;
  toFormData: (record: TRecord) => TForm;

  onCreate: (formData: TForm) => void;
  onUpdate: (record: TRecord, formData: TForm) => void;
};
