
import Joi from "joi";
import type { FormFieldConfig } from "@/global/forms/types/generic-form.types";
import type { PortStatus } from "@libs/united_packages";

export type PortFormData = {
  name: string;
  longitude: string;
  latitude: string;
  status: PortStatus;
};

export const portFields: FormFieldConfig<PortFormData>[] = [
  {
    name: "name",
    label: "שם הנמל",
    type: "text",
    required: true,
  },
  {
    name: "longitude",
    label: "קו אורך",
    type: "number",
    required: true,
  },
  {
    name: "latitude",
    label: "קו רוחב",
    type: "number",
    required: true,
  },
  {
    name: "status",
    label: "סטטוס",
    type: "select",
    required: true,
    options: [
      { label: "פעיל", value: "active" },
      { label: "לא פעיל", value: "inactive" },
    ],
  },
];

export const portSchema = Joi.object({
  name: Joi.string().trim().required(),
  longitude: Joi.number().min(-180).max(180).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  status: Joi.string().valid("active", "inactive").required(),
});
