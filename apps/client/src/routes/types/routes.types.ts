export type RouteStatus = 'active' | 'inactive';

export type GeoJsonLineString = {
  type: 'LineString';
  coordinates: [number, number][];
};

export type NormalizedRoute = {
  id: string;
  name: string;
  startPortId: string;
  endPortId: string;
  startPortName: string;
  endPortName: string;
  totalLengthNm: number;
  geometry: GeoJsonLineString | null;
  status: RouteStatus;
};