
import type { TableInfoInterface } from "@/global/types/generic-table.types";
import type { NormalizedStop } from "@/stops/types/stops.types";

export const STOP_TABLE_TILE_INFO: TableInfoInterface<NormalizedStop>[] = [
  {
    label: "מזהה",
    key: "id",
  },
  {
    label: "מזהה הפלגה",
    key: "voyage_id",
  },
  {
    label: "נמל",
    key: "port_id",
  },
  {
    label: "סדר עצירה",
    key: "sequence_number",
  },
  {
    label: "הגעה משוערת",
    key: "estimated_arrival_at",
  },
  {
    label: "הגעה בפועל",
    key: "actual_arrival_at",
  },
  {
    label: "סטטוס",
    key: "status",
  },
];
