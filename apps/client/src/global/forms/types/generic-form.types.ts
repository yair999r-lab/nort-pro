import type { HTMLInputTypeAttribute } from 'react';
import type {
  Breakpoint,
  SxProps,
  TextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import type { Theme } from '@emotion/react';
import type { OptionValueInterface } from './useFormTypes';

export type FormFieldConfig<T extends { [key: string]: any }> = {
  name: keyof T & string;
  label: string;
  type?: HTMLInputTypeAttribute | 'select';
  options?: OptionValueInterface[];
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  sx?: SxProps<Theme>;
  variant?: TextFieldVariants;
  textFieldProps?: TextFieldProps;
  breakPoint?: Partial<Record<Breakpoint, number>>;
};
