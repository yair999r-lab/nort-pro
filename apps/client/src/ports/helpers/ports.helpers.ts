
import type { TableInfoInterface } from "@/global/types/generic-table.types";
import type { NormalizedPort } from "@/ports/types/ports.types";

export const PORT_TABLE_TILE_INFO: TableInfoInterface<NormalizedPort>[] = [
  {
    label: "מזהה",
    key: "id",
  },
  {
    label: "שם הנמל",
    key: "name",
  },
  {
    label: "קו אורך",
    key: "longitude",
  },
  {
    label: "קו רוחב",
    key: "latitude",
  },
  {
    label: "סטטוס",
    key: "status",
  },
];
