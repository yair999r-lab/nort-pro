import type { PortInterface } from '@libs/united_packages';
import type { NormalizedPort } from '@/ports/types/ports.types';

export const normalizePort = (
  port: PortInterface,
): NormalizedPort => {
  const { longitude, latitude } = port;

  return {
    id: String(port.port_id),
    name: port.port_name,
    longitude,
    latitude,
    location:
      longitude !== null && latitude !== null
        ? {
            type: 'Point',
            coordinates: [longitude, latitude],
          }
        : null,
    status: port.status,
  };
};

export const normalizePorts = (
  ports: PortInterface[],
): NormalizedPort[] => ports.map(normalizePort);