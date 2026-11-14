import type { ShipInterface } from '@libs/united_packages';
import type { NormalizedShip } from '@/ships/types/ships.types';

export const normalizeShip = (ship: ShipInterface): NormalizedShip => ({
  id: String(ship.ship_id),
  name: ship.ship_name,
  homePortId: String(ship.home_port_id),
  currentPortId:
    ship.current_port_id === null ? 'לא משויך' : String(ship.current_port_id),

  routeId: ship.route_id === null ? 'לא משויך' : String(ship.route_id),
  capacityTons: (ship.capacity_weight_kg / 1000).toFixed(2),
  speedKnots: String(ship.speed_knots),
  fuelConsumptionTonsPerDay: String(ship.fuel_consumption_tons_per_day),
  status: ship.status,
});

export const normalizeShips = (ships: ShipInterface[]): NormalizedShip[] =>
  ships.map(normalizeShip);
