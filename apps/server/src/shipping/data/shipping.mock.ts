export interface Port {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Ship {
  id: string;
  name: string;
  homePortId: string;
  currentPortId: string;
  capacityKg: number;
  speedKnots: number;
  fuelTonsPerDay: number;
  availableFrom: string;
  routeId: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface Route {
  id: string;
  name: string;
  startPortId: string;
  endPortId: string;
  status: 'active' | 'inactive';
}

export interface RouteStop {
  routeId: string;
  portId: string;
  stopOrder: number;
}

export interface Shipment {
  id: string;
  description: string;
  originPortId: string;
  destinationPortId: string;
  weightKg: number;
  requiredArrival: string;
  status: 'pending' | "allocated";
}

export interface Voyage {
  id: string;
  shipId: string;
  fromPortId: string;
  toPortId: string;
  departureAt: string;
  arrivalAt: string;
  currentLoadWeightKg: number;
}

export interface RouteVoyage {
  routeId: string;
  voyageId: string;
}

// מועד תחילת הסימולציה
export const simulationStart = '2026-11-01T08:00:00+02:00';

// --------------------
// PORTS
// --------------------

export const ports: Port[] = [
  {
    id: 'port-haifa',
    name: 'חיפה',
    country: 'ישראל',
    latitude: 32.8191,
    longitude: 34.9984,
  },
  {
    id: 'port-ashdod',
    name: 'אשדוד',
    country: 'ישראל',
    latitude: 31.8044,
    longitude: 34.6553,
  },
  {
    id: 'port-larnaca',
    name: 'לרנקה',
    country: 'קפריסין',
    latitude: 34.9229,
    longitude: 33.6384,
  },
  {
    id: 'port-limassol',
    name: 'לימסול',
    country: 'קפריסין',
    latitude: 34.675,
    longitude: 33.0442,
  },
  {
    id: 'port-mersin',
    name: 'מרסין',
    country: 'טורקיה',
    latitude: 36.8,
    longitude: 34.6333,
  },
  {
    id: 'port-alexandria',
    name: 'אלכסנדריה',
    country: 'מצרים',
    latitude: 31.2001,
    longitude: 29.9187,
  },
];

// --------------------
// SHIPS
// --------------------

export const ships: Ship[] = [
  {
    id: 'ship-1',
    name: 'Endeavour',
    homePortId: 'port-haifa',
    currentPortId: 'port-haifa',
    capacityKg: 7_700_000,
    speedKnots: 14,
    fuelTonsPerDay: 17,
    availableFrom: simulationStart,
    status: 'active',
    routeId: 'route-1',
  },
  {
    id: 'ship-2',
    name: 'Mayflower',
    homePortId: 'port-larnaca',
    currentPortId: 'port-larnaca',
    capacityKg: 7_700_000,
    speedKnots: 14,
    fuelTonsPerDay: 17,
    availableFrom: simulationStart,
    status: 'active',
    routeId: 'route-2',
  },
  {
    id: 'ship-3',
    name: 'Beagle',
    homePortId: 'port-mersin',
    currentPortId: 'port-mersin',
    capacityKg: 7_700_000,
    speedKnots: 14,
    fuelTonsPerDay: 17,
    availableFrom: simulationStart,
    status: 'active',
    routeId: 'route-3',
  },
];

// --------------------
// ROUTES
// --------------------

export const routes: Route[] = [
  {
    id: 'route-1',
    name: 'מסלול Endeavour',
    startPortId: 'port-haifa',
    endPortId: 'port-haifa',
    status: 'active',
  },
  {
    id: 'route-2',
    name: 'מסלול Mayflower',
    startPortId: 'port-larnaca',
    endPortId: 'port-larnaca',
    status: 'active',
  },
  {
    id: 'route-3',
    name: 'מסלול Beagle',
    startPortId: 'port-mersin',
    endPortId: 'port-mersin',
    status: 'active',
  },
];

// --------------------
// ROUTE STOPS
// --------------------

export const routeStops: RouteStop[] = [
  // Endeavour
  { routeId: 'route-1', portId: 'port-haifa', stopOrder: 1 },
  { routeId: 'route-1', portId: 'port-ashdod', stopOrder: 2 },
  { routeId: 'route-1', portId: 'port-larnaca', stopOrder: 3 },
  { routeId: 'route-1', portId: 'port-limassol', stopOrder: 4 },
  { routeId: 'route-1', portId: 'port-mersin', stopOrder: 5 },
  { routeId: 'route-1', portId: 'port-alexandria', stopOrder: 6 },

  // Mayflower
  { routeId: 'route-2', portId: 'port-larnaca', stopOrder: 1 },
  { routeId: 'route-2', portId: 'port-limassol', stopOrder: 2 },
  { routeId: 'route-2', portId: 'port-mersin', stopOrder: 3 },
  { routeId: 'route-2', portId: 'port-alexandria', stopOrder: 4 },
  { routeId: 'route-2', portId: 'port-haifa', stopOrder: 5 },
  { routeId: 'route-2', portId: 'port-ashdod', stopOrder: 6 },

  // Beagle
  { routeId: 'route-3', portId: 'port-mersin', stopOrder: 1 },
  { routeId: 'route-3', portId: 'port-alexandria', stopOrder: 2 },
  { routeId: 'route-3', portId: 'port-haifa', stopOrder: 3 },
  { routeId: 'route-3', portId: 'port-ashdod', stopOrder: 4 },
  { routeId: 'route-3', portId: 'port-larnaca', stopOrder: 5 },
  { routeId: 'route-3', portId: 'port-limassol', stopOrder: 6 },
];

// --------------------
// SHIPMENTS
// --------------------

export const shipments: Shipment[] = [
  {
    id: 'SHP-1001',
    description: 'ציוד אלקטרוני',
    originPortId: 'port-haifa',
    destinationPortId: 'port-larnaca',
    weightKg: 450_000,
    requiredArrival: '2026-11-06T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1002',
    description: 'חלקי חילוף למכונות',
    originPortId: 'port-ashdod',
    destinationPortId: 'port-mersin',
    weightKg: 1_200_000,
    requiredArrival: '2026-11-09T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1003',
    description: 'מזון יבש',
    originPortId: 'port-larnaca',
    destinationPortId: 'port-alexandria',
    weightKg: 650_000,
    requiredArrival: '2026-11-08T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1004',
    description: 'ציוד רפואי',
    originPortId: 'port-limassol',
    destinationPortId: 'port-haifa',
    weightKg: 320_000,
    requiredArrival: '2026-11-07T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1005',
    description: 'חומרי גלם',
    originPortId: 'port-mersin',
    destinationPortId: 'port-ashdod',
    weightKg: 2_400_000,
    requiredArrival: '2026-11-15T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1006',
    description: 'טקסטיל',
    originPortId: 'port-alexandria',
    destinationPortId: 'port-larnaca',
    weightKg: 800_000,
    requiredArrival: '2026-11-12T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1007',
    description: 'ציוד תעשייתי כבד',
    originPortId: 'port-ashdod',
    destinationPortId: 'port-alexandria',
    weightKg: 900_000,
    requiredArrival: '2026-11-10T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1008',
    description: 'מוצרי צריכה',
    originPortId: 'port-haifa',
    destinationPortId: 'port-limassol',
    weightKg: 3_100_000,
    requiredArrival: '2026-11-17T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1009',
    description: 'ציוד תקשורת',
    originPortId: 'port-larnaca',
    destinationPortId: 'port-ashdod',
    weightKg: 180_000,
    requiredArrival: '2026-11-05T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1010',
    description: 'מטען תעשייתי גדול',
    originPortId: 'port-mersin',
    destinationPortId: 'port-haifa',
    weightKg: 6_900_000,
    requiredArrival: '2026-11-04T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1011',
    description: 'מוצרי מזון',
    originPortId: 'port-alexandria',
    destinationPortId: 'port-mersin',
    weightKg: 250_000,
    requiredArrival: '2026-11-11T18:00:00+02:00',
    status: 'pending',
  },
  {
    id: 'SHP-1012',
    description: 'ציוד בנייה',
    originPortId: 'port-limassol',
    destinationPortId: 'port-mersin',
    weightKg: 120_000,
    requiredArrival: '2026-11-06T18:00:00+02:00',
    status: 'pending',
  },
];
export interface PortDistance {
  id: string;
  fromPortId: string;
  toPortId: string;
  distanceNm: number;
}

export const portDistances: PortDistance[] = [
  {
    id: 'distance-1',
    fromPortId: 'port-haifa',
    toPortId: 'port-ashdod',
    distanceNm: 67,
  },
  {
    id: 'distance-2',
    fromPortId: 'port-ashdod',
    toPortId: 'port-larnaca',
    distanceNm: 201,
  },
  {
    id: 'distance-3',
    fromPortId: 'port-larnaca',
    toPortId: 'port-limassol',
    distanceNm: 34.1,
  },
  {
    id: 'distance-4',
    fromPortId: 'port-limassol',
    toPortId: 'port-mersin',
    distanceNm: 151, // הערכה זמנית
  },
  {
    id: 'distance-5',
    fromPortId: 'port-mersin',
    toPortId: 'port-alexandria',
    distanceNm: 425.6,
  },
  {
    id: 'distance-6',
    fromPortId: 'port-alexandria',
    toPortId: 'port-haifa',
    distanceNm: 338.4,
  },
];

export const voyages: Voyage[] = [
  {
    id: 'voyage-test-1',
    shipId: 'ship-1',
    fromPortId: 'port-haifa',
    toPortId: 'port-ashdod',
    departureAt: '2026-11-01T08:00:00+02:00',
    arrivalAt: '2026-11-01T12:47:08.571+02:00',
    currentLoadWeightKg: 7_000_000,
  },
];

export const routeVoyages: RouteVoyage[] = [
  {
    routeId: 'route-1',
    voyageId: 'voyage-test-1',
  },
];

export interface ShipmentVoyage {
  shipmentId: string;
  voyageId: string;
}

export const shipmentVoyages: ShipmentVoyage[] = [];