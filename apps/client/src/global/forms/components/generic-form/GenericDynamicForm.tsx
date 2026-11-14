import type { CSSProperties } from 'react';
import type Joi from 'joi';
import type { FormFieldConfig } from '../../types/generic-form.types';
import { Grid2 } from '@mui/material';
import useForm from '../../hooks/useForm';
import GenericForm from './GenericForm';
import FormInput from '../form-input/FormInput';

type GenericDynamicFormProps<T extends { [key: string]: any }> = {
  fields: FormFieldConfig<T>[];
  schema: Joi.ObjectSchema<any>;
  initialData: T;
  onSubmit: (data: T) => void;
  title?: string;
  subTitle?: string;
  submitButtonText?: string;
  formStyle?: CSSProperties;
};

const GenericDynamicForm = <T extends { [key: string]: any }>({
  fields,
  schema,
  initialData,
  onSubmit,
  title,
  subTitle,
  submitButtonText,
  formStyle,
}: GenericDynamicFormProps<T>) => {
  const { data, errors, validateForm, handleSubmit, handleChange } = useForm(
    initialData,
    schema,
    onSubmit,
  );
  return (
    <GenericForm
      handleSubmit={handleSubmit}
      validateForm={validateForm}
      title={title}
      subTitle={subTitle}
      submitButtonText={submitButtonText}
      formStyle={formStyle}
    > <Grid2 container spacing={1}>
        {fields.map((field) => (
            <FormInput
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            value={data[field.name]}
            errors={errors}
            onChange={handleChange}
            options={field.options}
            required={field.required}
            disabled={field.disabled}
            rows={field.rows}
            sx={field.sx}
            variant={field.variant}
            textFieldProps={field.textFieldProps}
            breakPoint={field.breakPoint}
            />
        ))}
        </Grid2>
        </GenericForm>
  );
};

export default GenericDynamicForm;
