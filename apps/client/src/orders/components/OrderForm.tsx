import Joi from "joi";
import GenericDynamicForm from "@/global/forms/components/generic-form/GenericDynamicForm";
import type { FormFieldConfig } from "@/global/forms/types/generic-form.types";

export type OrderFormData = {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
};

export type OrdersFormProps = {
  initialData: OrderFormData;
  onSubmit: (data: OrderFormData) => void;
  submitButtonText?: string;
};

export const orderFields: FormFieldConfig<OrderFormData>[] = [
  {
    name: "customer_name",
    label: "שם הלקוח",
    type: "text",
    required: true,
  },
  {
    name: "customer_phone",
    label: "טלפון",
    type: "text",
    required: true,
  },
  {
    name: "customer_address",
    label: "כתובת",
    type: "text",
    required: true,
  },
];

export const orderSchema = Joi.object({
  customer_name: Joi.string().required(),
  customer_phone: Joi.string().required(),
  customer_address: Joi.string().required(),
});

export const OrdersForm = ({
  initialData,
  onSubmit,
  submitButtonText = "שמירה",
}: OrdersFormProps) => {
  return (
    <GenericDynamicForm<OrderFormData>
      fields={orderFields}
      schema={orderSchema}
      initialData={initialData}
      onSubmit={onSubmit}
      submitButtonText={submitButtonText}
    />
  );
};