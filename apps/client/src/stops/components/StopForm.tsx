
import Joi from "joi";
import type { FormFieldConfig } from "@/global/forms/types/generic-form.types";
import type { StopStatus } from "@/stops/types/stops.types";

type SelectOption = {
  label: string;
  value: string;
};

export type StopFormData = {
  voyage_id: string;
  port_id: string;
  sequence_number: string;
  estimated_arrival_at: string;
  actual_arrival_at: string;
  status: StopStatus;
};

const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const createStopFields = (
  voyageOptions: SelectOption[],
  portOptions: SelectOption[],
): FormFieldConfig<StopFormData>[] => [
  {
    name: "voyage_id",
    label: "הפלגה",
    type: "select",
    required: true,
    options: voyageOptions,
  },
  {
    name: "port_id",
    label: "נמל העצירה",
    type: "select",
    required: true,
    options: portOptions,
  },
  {
    name: "sequence_number",
    label: "סדר העצירה",
    type: "number",
    required: true,
  },
  {
    name: "estimated_arrival_at",
    label: "הגעה משוערת",
    type: "datetime-local",
    required: true,
  },
  {
    name: "actual_arrival_at",
    label: "הגעה בפועל",
    type: "datetime-local",
  },
  {
    name: "status",
    label: "סטטוס",
    type: "select",
    required: true,
    options: [
      { label: "מתוכננת", value: "planned" },
      { label: "בדרך לנמל", value: "approaching" },
      { label: "הגיעה", value: "arrived" },
      { label: "עזבה", value: "departed" },
      { label: "דילגה על העצירה", value: "skipped" },
    ],
  },
];

const optionalDateTime = Joi.string()
  .pattern(dateTimePattern)
  .allow("");

export const stopSchema = Joi.object({
  voyage_id: Joi.string().pattern(/^[1-9]\d*$/).required(),

  port_id: Joi.string().pattern(/^[1-9]\d*$/).required(),

  sequence_number: Joi.string()
    .pattern(/^[1-9]\d*$/)
    .required(),

  estimated_arrival_at: Joi.string()
    .pattern(dateTimePattern)
    .required(),

  actual_arrival_at: optionalDateTime.required(),

  status: Joi.string()
    .valid("planned", "approaching", "arrived", "departed", "skipped")
    .required(),
});
