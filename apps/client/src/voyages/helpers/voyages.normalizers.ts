import type { VoyageInterface } from '@libs/united_packages';
import type { NormalizedVoyage } from '@/voyages/types/voyages.types';

export const normalizeVoyage = (
  voyage: VoyageInterface,
): NormalizedVoyage => ({
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