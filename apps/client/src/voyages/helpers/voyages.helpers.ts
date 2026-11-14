import type { TableInfoInterface } from '@/global/types/generic-table.types';
import type { NormalizedVoyage } from '@/voyages/types/voyages.types';

export const VOYAGE_TABLE_TILE_INFO: TableInfoInterface<NormalizedVoyage>[] = [
  { label: 'מזהה', key: 'id' },
  { label: 'מזהה אונייה', key: 'ship_id' },
  { label: 'נמל מוצא', key: 'origin_port_id' },
  { label: 'נמל יעד', key: 'destination_port_id' },
  { label: 'מרחק (מייל ימי)', key: 'distance_nm' },
  { label: 'תאריך יציאה', key: 'departure_date' },
  { label: 'הגעה משוערת', key: 'estimated_arrival' },
  { label: 'עומס נוכחי (ק״ג)', key: 'current_load_weight_kg' },
  { label: 'סטטוס', key: 'status' },
];