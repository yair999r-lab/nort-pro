import type { PortStatus } from '@libs/united_packages';

export type GeoJsonPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export type NormalizedPort = {
  id: string;
  name: string;
  longitude: number | null;
  latitude: number | null;
  location: GeoJsonPoint | null;
  status: PortStatus;
};