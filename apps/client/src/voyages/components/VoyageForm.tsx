
import Joi from 'joi';
import type { FormFieldConfig } from '@/global/forms/types/generic-form.types';

type SelectOption = {
  label: string;
  value: string;
};

export type VoyageFormData = {
  ship_id: string;
  origin_port_id: string;
  destination_port_id: string;
  distance_nm: string;
  departure_date: string;
  estimated_arrival: string;
  current_load_weight_kg: string;
  status: string;
};

const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const createVoyageFields = (
  shipOptions: SelectOption[],
  portOptions: SelectOption[],
): FormFieldConfig<VoyageFormData>[] => [
  {
    name: 'ship_id',
    label: 'אונייה',
    type: 'select',
    required: true,
    options: shipOptions,
  },
  {
    name: 'origin_port_id',
    label: 'נמל מוצא',
    type: 'select',
    required: true,
    options: portOptions,
  },
  {
    name: 'destination_port_id',
    label: 'נמל יעד',
    type: 'select',
    required: true,
    options: portOptions,
  },
  {
    name: 'distance_nm',
    label: 'מרחק (מייל ימי)',
    type: 'number',
    required: true,
  },
  {
    name: 'departure_date',
    label: 'תאריך יציאה',
    type: 'datetime-local',
    required: true,
  },
  {
    name: 'estimated_arrival',
    label: 'הגעה משוערת',
    type: 'datetime-local',
    required: true,
  },
  {
    name: 'current_load_weight_kg',
    label: 'עומס נוכחי (ק״ג)',
    type: 'number',
    required: true,
  },
  {
    name: 'status',
    label: 'סטטוס',
    type: 'select',
    required: true,
    options: [
      { label: 'מתוכננת', value: 'scheduled' },
      { label: 'בתהליך', value: 'in_progress' },
      { label: 'הושלמה', value: 'completed' },
      { label: 'בוטלה', value: 'cancelled' },
    ],
  },
];

const positiveNumber = Joi.string()
  .pattern(/^\d+(\.\d+)?$/)
  .required();

export const voyageSchema = Joi.object({
  ship_id: Joi.string().pattern(/^\d+$/).required(),

  origin_port_id: Joi.string().pattern(/^\d+$/).required(),

  destination_port_id: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .invalid(Joi.ref('origin_port_id')),

  distance_nm: positiveNumber,

  departure_date: Joi.string()
    .pattern(dateTimePattern)
    .required(),

  estimated_arrival: Joi.string()
    .pattern(dateTimePattern)
    .required(),

  current_load_weight_kg: positiveNumber,

  status: Joi.string()
    .valid('scheduled', 'in_progress', 'completed', 'cancelled')
    .required(),
});
