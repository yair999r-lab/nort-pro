import Joi from 'joi';
import type { FormFieldConfig } from '@/global/forms/types/generic-form.types';
import type { RouteStatus } from '@/routes/types/routes.types';

export type RouteFormData = {
  route_name: string;
  start_port_id: string;
  end_port_id: string;
  total_length_nm: string;
  status: RouteStatus;
};

type PortOption = {
  label: string;
  value: string;
};

export const createRouteFields = (
  portOptions: PortOption[],
): FormFieldConfig<RouteFormData>[] => [
  {
    name: 'route_name',
    label: 'שם המסלול',
    type: 'text',
    required: true,
  },
  {
    name: 'start_port_id',
    label: 'נמל התחלה',
    type: 'select',
    required: true,
    options: portOptions,
  },
  {
    name: 'end_port_id',
    label: 'נמל סיום',
    type: 'select',
    required: true,
    options: portOptions,
  },
  {
    name: 'total_length_nm',
    label: 'אורך המסלול (מייל ימי)',
    type: 'number',
    required: true,
  },
  {
    name: 'status',
    label: 'סטטוס',
    type: 'select',
    required: true,
    options: [
      { label: 'פעיל', value: 'active' },
      { label: 'לא פעיל', value: 'inactive' },
    ],
  },
];

export const routeSchema = Joi.object({
  route_name: Joi.string().trim().required(),

  start_port_id: Joi.string().pattern(/^\d+$/).required(),

  end_port_id: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .invalid(Joi.ref('start_port_id'))
    .messages({
      'any.invalid': 'נמל הסיום חייב להיות שונה מנמל ההתחלה',
    }),

  total_length_nm: Joi.number().positive().required(),

  status: Joi.string().valid('active', 'inactive').required(),
});