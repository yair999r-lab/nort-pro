import { getAllShipsDAL } from '../../ships/dal/ships.dal';
import { getAllRoutesDAL } from '../../routes/dal/routes.dal';
import { getAllShipmentsDAL } from '../../shipments/dal/shipments.dal';
import { getAllVoyagesDAL } from '../../voyages/dal/voyages.dal';
import { getAllRouteStopsDAL } from '../../route-stops/dal/route-stops.dal';
import { getAllRouteVoyagesDAL } from '../../route-voyages/dal/route-voyages.dal';
import { getAllPortDistancesDAL } from '../../port-distances/dal/port-distances.dal';
import { getAllShipmentVoyagesDAL } from '../../shipment-voyages/dal/shipment-voyages.dal';

import type { AllocationContext } from '../types/allocation.types';

const toPositiveNumberOrNull = (value: string | null): number | null => {
  if (value === null) return null;

  const number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : null;
};

const normalizeTimestamp = (value: Date | string): string => {
  return value instanceof Date ? value.toISOString() : value;
};

const normalizeNullableTimestamp = (
  value: Date | string | null,
): string | null => {
  return value === null ? null : normalizeTimestamp(value);
};

export const loadAllocationContextFromDatabase =
  async (): Promise<AllocationContext> => {
    const [
      shipRows,
      routeRows,
      shipmentRows,
      voyageRows,
      stopRows,
      routeVoyageRows,
      distanceRows,
      shipmentVoyageRows,
    ] = await Promise.all([
      getAllShipsDAL(),
      getAllRoutesDAL(),
      getAllShipmentsDAL(),
      getAllVoyagesDAL(),
      getAllRouteStopsDAL(),
      getAllRouteVoyagesDAL(),
      getAllPortDistancesDAL(),
      getAllShipmentVoyagesDAL(),
    ]);

    return {
      shipments: shipmentRows.flatMap((shipment) => {
        const weightKg = Number(shipment.total_weight_kg);

        if (
          shipment.total_weight_kg === null ||
          !Number.isFinite(weightKg) ||
          weightKg <= 0
        ) {
          return [];
        }

        return [
          {
            id: String(shipment.shipment_id),
            description: shipment.product_name,
            originPortId: String(shipment.origin_port_id),
            destinationPortId: String(shipment.destination_port_id),
            weightKg,
            requiredArrival: shipment.required_arrival,
            status: shipment.status,
          },
        ];
      }),

      ships: shipRows.flatMap((ship) => {
        if (ship.current_port_id === null) {
          return [];
        }

        return [
          {
            id: String(ship.ship_id),
            name: ship.ship_name,
            routeId: String(ship.route_id),
            homePortId: String(ship.home_port_id),
            currentPortId: String(ship.current_port_id),
            capacityKg: Number(ship.capacity_weight_kg),
            speedKnots: Number(ship.speed_knots),

            fuelCapacityTons: toPositiveNumberOrNull(ship.fuel_capacity_tons),

            fuelConsumptionTonsPerNm: toPositiveNumberOrNull(
              ship.fuel_consumption_tons_per_nm,
            ),

            fuelTonsPerDay: Number(ship.fuel_consumption_tons_per_day),
            status: ship.status,
          },
        ];
      }),

      routes: routeRows.map((route) => ({
        id: String(route.route_id),
        name: route.route_name,

        startPortId: String(route.start_port_id),
        endPortId: String(route.end_port_id),
        totalLengthNm: Number(route.total_length_nm),

        plannedDepartureAt: normalizeNullableTimestamp(
          route.planned_departure_at,
        ),

        returnDeadlineAt: normalizeNullableTimestamp(route.return_deadline_at),

        estimatedReturnAt: normalizeNullableTimestamp(
          route.estimated_return_at,
        ),

        actualReturnAt: normalizeNullableTimestamp(route.actual_return_at),

        status: route.status,
        shipId: route.ship_id === null ? null : String(route.ship_id),
        routeKind: route.route_kind,
        isCurrentPlan: route.is_current_plan,
        planVersion: Number(route.plan_version),
      })),

      routeStops: stopRows.map((stop) => ({
        routeId: String(stop.route_id),
        portId: String(stop.port_id),
        stopOrder: stop.stop_order,
      })),

      portDistances: distanceRows.map((distance) => ({
        fromPortId: String(distance.from_port_id),
        toPortId: String(distance.to_port_id),
        distanceNm: Number(distance.distance_nm),
        routeGeometry: distance.route_geometry,
      })),

      voyages: voyageRows.map((voyage) => ({
        id: String(voyage.voyage_id),
        shipId: String(voyage.ship_id),
        fromPortId: String(voyage.origin_port_id),
        toPortId: String(voyage.destination_port_id),
        departureAt: normalizeTimestamp(voyage.departure_date),
        arrivalAt: normalizeTimestamp(voyage.estimated_arrival),
        currentLoadWeightKg: Number(voyage.current_load_weight_kg),
      })),

      routeVoyages: routeVoyageRows.map((item) => ({
        routeId: String(item.route_id),
        voyageId: String(item.voyage_id),
        segmentOrder: item.segment_order,
      })),
      shipmentVoyages: shipmentVoyageRows.map((link) => ({
        shipmentId: String(link.shipment_id),
        routeId: link.route_id === null ? null : String(link.route_id),
        voyageId: String(link.voyage_id),
        legOrder: link.leg_order,
      })),
    };
  };
