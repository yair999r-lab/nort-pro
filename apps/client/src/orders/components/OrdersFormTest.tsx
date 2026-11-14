import Joi from "joi";
import GenericDynamicForm from "@/global/forms/components/generic-form/GenericDynamicForm";
import type { FormFieldConfig } from "@/global/forms/types/generic-form.types";


type OrderFormData = {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
};

const initialOrder: OrderFormData = {
  customer_name: "",
  customer_phone: "",
  customer_address: "",
};

const orderFields: FormFieldConfig<OrderFormData>[] = [
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

const orderSchema = Joi.object({
  customer_name: Joi.string().required(),
  customer_phone: Joi.string().required(),
  customer_address: Joi.string().required(),
});

export const OrdersFormTest = () => {
    const handleSubmit  = (formData: OrderFormData) => {
        console.log("Submitted form data:", formData)
    }
    return (
        <GenericDynamicForm<OrderFormData>
         fields={orderFields} 
        schema={orderSchema}
        initialData={initialOrder}
        onSubmit={handleSubmit}
        title="בדיקת טופס הזמנה"
      submitButtonText="בדיקת שליחה"
        />
    )
}
