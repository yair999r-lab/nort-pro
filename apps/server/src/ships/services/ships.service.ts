import type { ShipInterface } from '@libs/united_packages';

import { getAllShipsDAL } from '../dal/ships.dal';

export const getAllShipsService = async (): Promise<ShipInterface[]> => {
  const ships = await getAllShipsDAL();

  return ships.map((ship) => ({
    ship_id: ship.ship_id,
    ship_name: ship.ship_name,
    route_id: ship.route_id,
    capacity_weight_kg: Number(ship.capacity_weight_kg),
    speed_knots: Number(ship.speed_knots),
    fuel_consumption_tons_per_day: Number(ship.fuel_consumption_tons_per_day),
    fuel_capacity_tons:
      ship.fuel_capacity_tons === null ? null : Number(ship.fuel_capacity_tons),
    fuel_consumption_tons_per_nm:
      ship.fuel_consumption_tons_per_nm === null
        ? null
        : Number(ship.fuel_consumption_tons_per_nm),
    home_port_id: ship.home_port_id,
    current_port_id: ship.current_port_id,
    status: ship.status,
  }));
};
