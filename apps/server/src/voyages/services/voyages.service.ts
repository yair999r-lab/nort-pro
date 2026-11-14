import type { VoyageInterface } from '@libs/united_packages';

import { getAllVoyagesDAL } from '../dal/voyages.dal';

export const getAllVoyagesService = async (): Promise<VoyageInterface[]> => {
  const voyages = await getAllVoyagesDAL();

  return voyages.map((voyage) => ({
    voyage_id: voyage.voyage_id,
    ship_id: voyage.ship_id,
    origin_port_id: voyage.origin_port_id,
    destination_port_id: voyage.destination_port_id,
    distance_nm: Number(voyage.distance_nm),
    departure_date: voyage.departure_date,
    estimated_arrival: voyage.estimated_arrival,
    current_load_weight_kg: Number(voyage.current_load_weight_kg),
    status: voyage.status,
  }));
};