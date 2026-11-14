import axios from 'axios';

import type {
  PortInterface,
  PortDistanceInterface,
  ShipInterface,
  RouteInterface,
  RouteStopInterface,
  RouteVoyageInterface,
  ShipmentInterface,
  VoyageInterface,
} from '@libs/united_packages';

import type { ShippingData, AllocationOption } from '../types/shipping.types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

// טעינת נתוני השילוח האמיתיים
export const getShippingData = async (): Promise<ShippingData> => {
  const [
    portsResponse,
    distancesResponse,
    shipsResponse,
    routesResponse,
    stopsResponse,
    routeVoyagesResponse,
    shipmentsResponse,
    voyagesResponse,
  ] = await Promise.all([
    axios.get<PortInterface[]>(`${SERVER_URL}/ports`),
    axios.get<PortDistanceInterface[]>(`${SERVER_URL}/port-distances`),
    axios.get<ShipInterface[]>(`${SERVER_URL}/ships`),
    axios.get<RouteInterface[]>(`${SERVER_URL}/routes`),
    axios.get<RouteStopInterface[]>(`${SERVER_URL}/route-stops`),
    axios.get<RouteVoyageInterface[]>(`${SERVER_URL}/route-voyages`),
    axios.get<ShipmentInterface[]>(`${SERVER_URL}/shipments`),
    axios.get<VoyageInterface[]>(`${SERVER_URL}/voyages`),
  ]);

  return {
    ports: portsResponse.data.map((port) => ({
      id: String(port.port_id),
      name: port.port_name,
      city: port.city,
      country: port.country,
      latitude: port.latitude,
      longitude: port.longitude,
      status: port.status,
    })),

    portDistances: distancesResponse.data.map((distance) => ({
      fromPortId: String(distance.from_port_id),
      toPortId: String(distance.to_port_id),
      distanceNm: distance.distance_nm,
      distanceSource: distance.distance_source,
    })),

    ships: shipsResponse.data.map((ship) => ({
      id: String(ship.ship_id),
      name: ship.ship_name,
      homePortId: String(ship.home_port_id),
      currentPortId:
        ship.current_port_id === null ? null : String(ship.current_port_id),
      capacityKg: ship.capacity_weight_kg,
      speedKnots: ship.speed_knots,
      fuelTonsPerDay: ship.fuel_consumption_tons_per_day,
      routeId: ship.route_id === null ? null : String(ship.route_id),
      status: ship.status,
      fuelCapacityTons: ship.fuel_capacity_tons,
      fuelConsumptionTonsPerNm: ship.fuel_consumption_tons_per_nm,
    })),

    routes: routesResponse.data.map((route) => ({
      id: String(route.route_id),
      name: route.route_name,
      startPortId: String(route.start_port_id),
      endPortId: String(route.end_port_id),
      totalLengthNm: route.total_length_nm,
      status: route.status,
    })),

    routeStops: stopsResponse.data.map((stop) => ({
      routeId: String(stop.route_id),
      portId: String(stop.port_id),
      stopOrder: stop.stop_order,
    })),

    shipments: shipmentsResponse.data.map((shipment) => ({
      id: String(shipment.shipment_id),
      description: shipment.product_name,
      originPortId: String(shipment.origin_port_id),
      destinationPortId: String(shipment.destination_port_id),
      weightKg: shipment.total_weight_kg,
      requiredArrival: shipment.required_arrival,
      status: shipment.status,
    })),

    voyages: voyagesResponse.data.map((voyage) => ({
      id: String(voyage.voyage_id),
      shipId: String(voyage.ship_id),
      fromPortId: String(voyage.origin_port_id),
      toPortId: String(voyage.destination_port_id),
      distanceNm: voyage.distance_nm,
      departureAt: voyage.departure_date,
      arrivalAt: voyage.estimated_arrival,
      currentLoadWeightKg: voyage.current_load_weight_kg,
      status: voyage.status,
    })),

    routeVoyages: routeVoyagesResponse.data.map((item) => ({
      routeId: String(item.route_id),
      voyageId: String(item.voyage_id),
      segmentOrder: item.segment_order,
    })),
  };
};

// קבלת אפשרויות הקצאה למשלוח
export const getAllocationOptions = async (
  shipmentId: string,
): Promise<AllocationOption[]> => {
  const { data } = await axios.get<AllocationOption[]>(
    `${SERVER_URL}/shipping/shipments/${shipmentId}/allocation-options`,
  );

  return data;
};

// אישור הקצאה
export const confirmAllocation = async (
  shipmentId: string,
  shipId: string,
): Promise<void> => {
  await axios.post(`${SERVER_URL}/shipping/shipments/${shipmentId}/allocate`, {
    shipId,
  });
};
