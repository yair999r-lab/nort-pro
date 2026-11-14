import type { VoyageInterface } from '@libs/united_packages';
export type VoyageStatus = string;

export type NormalizedVoyage = {
  id: string;
  ship_id: number;
  origin_port_id: number;
  destination_port_id: number;
  distance_nm: number;
  departure_date: string;
  estimated_arrival: string;
  current_load_weight_kg: number;
  status: VoyageStatus;
};

export const normalizeVoyage = (voyage: VoyageInterface): NormalizedVoyage => ({
  id: String(voyage.voyage_id),
  ship_id: voyage.ship_id,
  origin_port_id: voyage.origin_port_id,
  destination_port_id: voyage.destination_port_id,
  distance_nm: voyage.distance_nm,
  departure_date: voyage.departure_date,
  estimated_arrival: voyage.estimated_arrival,
  current_load_weight_kg: voyage.current_load_weight_kg,
  status: voyage.status,
});

export const normalizeVoyages = (
  voyages: VoyageInterface[],
): NormalizedVoyage[] => voyages.map(normalizeVoyage);
