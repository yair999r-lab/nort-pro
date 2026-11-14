import type {
  ShippingData,
  AllocationOption,
  Route,
} from '../types/shipping.types';

import type {
  ShipmentAllocationRow,
  ShipAllocationRow,
  RouteAllocationRow,
  VoyageAllocationRow,
} from '../types/allocation-view.types';

const formatDate = (date: string | null): string => {
  if (!date) return 'לא צוין';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleString('he-IL', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const formatDistance = (distance: number): string =>
  `${distance.toLocaleString('he-IL', {
    maximumFractionDigits: 2,
  })} מייל ימי`;

const getPortName = (data: ShippingData, portId: string): string =>
  data.ports.find((port) => port.id === portId)?.name ?? portId;

export const buildShipmentAllocationRows = (
  data: ShippingData,
): ShipmentAllocationRow[] =>
  data.shipments
    .filter((shipment) => shipment.status === 'pending')
    .map((shipment) => ({
      ...shipment,
      originPortName: getPortName(data, shipment.originPortId),
      destinationPortName: getPortName(data, shipment.destinationPortId),
      weightDisplay: `${shipment.weightKg.toLocaleString('he-IL')} ק"ג`,
      requiredArrivalDisplay: formatDate(shipment.requiredArrival),
    }));

export const buildShipAllocationRows = (
  data: ShippingData,
  options: AllocationOption[],
): ShipAllocationRow[] =>
  options.flatMap((option) => {
    const ship = data.ships.find((item) => item.id === option.shipId);

    if (!ship) return [];

    return [
      {
        ...ship,
        totalDistanceDisplay: formatDistance(option.totalDistanceNm),
        estimatedReturnAtDisplay: formatDate(option.estimatedReturnAt),
        capacityDisplay: `${ship.capacityKg.toLocaleString('he-IL')} ק"ג`,
      },
    ];
  });

export const buildRouteAllocationRows = (
  data: ShippingData,
  options: AllocationOption[],
): RouteAllocationRow[] =>
  options.flatMap((option) => {
    const ship = data.ships.find((item) => item.id === option.shipId);

    if (!ship) return [];

    const plan = option.routePlan;
    const stops = plan.stops;

    const route: Route = {
      id: `draft-${option.shipId}`,
      name: `מסלול מוצע - ${ship.name}`,
      startPortId: stops[0]?.portId ?? ship.currentPortId ?? '',
      endPortId: stops[stops.length - 1]?.portId ?? ship.homePortId,
      totalLengthNm: option.totalDistanceNm,
      status: 'מוצע',
    };

    const stopsDisplay = stops
      .map((stop) => {
        const name = getPortName(data, stop.portId);

        const actions = [
          stop.pickups.length ? `איסוף ${stop.pickups.length}` : null,
          stop.deliveries.length ? `מסירה ${stop.deliveries.length}` : null,
        ].filter(Boolean);

        return actions.length ? `${name} (${actions.join(', ')})` : name;
      })
      .join(' → ');

    return [
      {
        ...route,
        shipId: ship.id,
        shipName: ship.name,
        stopsDisplay,
        departureAtDisplay: formatDate(plan.plannedDepartureAt),
        estimatedReturnAtDisplay: formatDate(plan.estimatedReturnAt),
        returnDeadlineAtDisplay: formatDate(plan.returnDeadlineAt),
      },
    ];
  });

export const buildVoyageAllocationRows = (
  data: ShippingData,
  selectedOption: AllocationOption | null,
): VoyageAllocationRow[] => {
  if (!selectedOption) return [];

  return selectedOption.routePlan.legs.map((leg, index) => ({
    ...leg,
    id: `${selectedOption.shipId}-${index + 1}`,
    fromPortName: getPortName(data, leg.fromPortId),
    toPortName: getPortName(data, leg.toPortId),
    departureAtDisplay: formatDate(leg.departureAt),
    arrivalAtDisplay: formatDate(leg.arrivalAt),
    distanceDisplay: formatDistance(leg.distanceNm),
    voyageTypeDisplay: 'מקטע מתוכנן',
    cargoStatusDisplay: leg.shipmentIds.length
      ? `${leg.shipmentIds.length} משלוחים`
      : 'ללא מטען',
  }));
};
