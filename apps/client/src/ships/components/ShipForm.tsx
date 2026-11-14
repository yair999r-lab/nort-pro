import Joi from 'joi';
import type { FormFieldConfig } from '@/global/forms/types/generic-form.types';
import type { ShipStatus } from '../types/ships.types';

export type ShipFormData = {
  name: string;
  homePortId: string;
  currentPortId: string;
  routeId: string;
  capacityTons: string;
  speedKnots: string;
  fuelConsumptionTonsPerDay: string;
  status: ShipStatus;
};

const positiveNumber = Joi.string()
  .pattern(/^\d+(\.\d+)?$/)
  .required();

const optionalId = Joi.string().allow('').pattern(/^\d*$/);

export const shipFields: FormFieldConfig<ShipFormData>[] = [
  { name: 'name', label: 'שם האונייה', type: 'text', required: true },
  {
    name: 'homePortId',
    label: 'מזהה נמל הבית',
    type: 'number',
    required: true,
  },
  { name: 'currentPortId', label: 'מזהה נמל נוכחי', type: 'number' },
  { name: 'routeId', label: 'מזהה מסלול', type: 'number' },
  {
    name: 'capacityTons',
    label: 'קיבולת (טון)',
    type: 'number',
    required: true,
  },
  { name: 'speedKnots', label: 'מהירות (קשר)', type: 'number', required: true },
  {
    name: 'fuelConsumptionTonsPerDay',
    label: 'צריכת דלק (טון ליום)',
    type: 'number',
    required: true,
  },
  {
    name: 'status',
    label: 'סטטוס',
    type: 'select',
    required: true,
    options: [
      { label: 'פעילה', value: 'active' },
      { label: 'לא פעילה', value: 'inactive' },
    ],
  },
];

export const shipSchema = Joi.object({
  name: Joi.string().trim().required(),
  homePortId: Joi.string().pattern(/^\d+$/).required(),
  currentPortId: optionalId,
  routeId: optionalId,
  capacityTons: positiveNumber,
  speedKnots: positiveNumber,
  fuelConsumptionTonsPerDay: positiveNumber,
  status: Joi.string().valid('active', 'inactive').required(),
});
