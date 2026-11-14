import { seaRoute, DEFAULT_MARNET } from 'searoute-ts';

import { getPortByIdDAL } from '../../ports/dal/ports.dal';

import {
  getPortDistanceByPortsDAL,
  insertPortDistanceDAL,
  updatePortDistanceGeometryDAL,
} from '../dal/port-distances.dal';

import type { PortRouteGeometry } from '../types/port-distances.db.types';

const KM_PER_NAUTICAL_MILE = 1.852;

const getCoordinate = (
  value: string | null,
  field: string,
): number => {
  if (value === null || !Number.isFinite(Number(value))) {
    throw new Error(`Invalid port coordinate: ${field}`);
  }

  return Number(value);
};

const calculateSeaRoute = async (
  fromPortId: number,
  toPortId: number,
): Promise<{ distanceNm: number; geometry: PortRouteGeometry }> => {
  const [fromPort, toPort] = await Promise.all([
    getPortByIdDAL(fromPortId),
    getPortByIdDAL(toPortId),
  ]);

  if (!fromPort || !toPort) {
    throw new Error('Origin or destination port was not found');
  }

  const origin: [number, number] = [
    getCoordinate(fromPort.longitude, 'origin longitude'),
    getCoordinate(fromPort.latitude, 'origin latitude'),
  ];

  const destination: [number, number] = [
    getCoordinate(toPort.longitude, 'destination longitude'),
    getCoordinate(toPort.latitude, 'destination latitude'),
  ];

  const route = seaRoute(origin, destination, {
    network: DEFAULT_MARNET,
    units: 'nauticalmiles',
    appendOriginDestination: true,
    antimeridian: 'unwrap',
  });

  if (
    route.geometry.type !== 'LineString' ||
    route.geometry.coordinates.length < 2
  ) {
    throw new Error('SeaRoute returned invalid geometry');
  }

  const geometry: PortRouteGeometry = {
    type: 'LineString',
    coordinates: route.geometry.coordinates as [number, number][],
  };

  const properties = route.properties;

  const distanceNm =
    properties.length +
    (properties.originSnapKm + properties.destinationSnapKm) /
      KM_PER_NAUTICAL_MILE;

  if (!Number.isFinite(distanceNm) || distanceNm <= 0) {
    throw new Error('SeaRoute returned an invalid distance');
  }

  return { distanceNm, geometry };
};

export const getOrCalculatePortDistance = async (
  fromPortId: number,
  toPortId: number,
): Promise<number> => {
  if (fromPortId === toPortId) return 0;

  const existing = await getPortDistanceByPortsDAL(
    fromPortId,
    toPortId,
  );

  if (existing) {
    const distance = Number(existing.distance_nm);

    if (!Number.isFinite(distance) || distance <= 0) {
      throw new Error('Existing port distance is invalid');
    }

    if (!existing.route_geometry) {
      const calculated = await calculateSeaRoute(
        fromPortId,
        toPortId,
      );

      await updatePortDistanceGeometryDAL(
        fromPortId,
        toPortId,
        calculated.geometry,
      );
    }

    return distance;
  }

  const calculated = await calculateSeaRoute(fromPortId, toPortId);

  const inserted = await insertPortDistanceDAL(
    fromPortId,
    toPortId,
    calculated.distanceNm,
    'searoute',
    calculated.geometry,
  );

  if (inserted) {
    return Number(inserted.distance_nm);
  }

  // Handle a parallel insert of the same port pair
  const saved = await getPortDistanceByPortsDAL(
    fromPortId,
    toPortId,
  );

  if (!saved) {
    throw new Error('Failed to save calculated port distance');
  }

  if (!saved.route_geometry) {
    await updatePortDistanceGeometryDAL(
      fromPortId,
      toPortId,
      calculated.geometry,
    );
  }

  return Number(saved.distance_nm);
};