import type { AllocationPortDistance } from '../types/allocation.types';

import { buildPortDistanceMap } from '../helpers/build-port-distance-map.helpers';

import { getOrCalculatePortDistance } from '../../port-distances/services/get-or-calculate-port-distance.service';

const getPairKey = (fromPortId: string, toPortId: string): string =>
  `${fromPortId}:${toPortId}`;

export const buildPortDistanceMatrix = async (
  portIds: string[],
  knownDistances: AllocationPortDistance[],
): Promise<Map<string, number>> => {
  const uniquePortIds = [...new Set(portIds)];

  const distanceMap = buildPortDistanceMap(knownDistances);

  // Pairs that already have maritime geometry
  const pairsWithGeometry = new Set(
    knownDistances
      .filter((item) => item.routeGeometry !== null)
      .map((item) => getPairKey(item.fromPortId, item.toPortId)),
  );

  const missingPairs: {
    fromPortId: string;
    toPortId: string;
  }[] = [];

  // Find pairs missing either distance or geometry
  for (const fromPortId of uniquePortIds) {
    for (const toPortId of uniquePortIds) {
      if (fromPortId === toPortId) continue;

      const key = getPairKey(fromPortId, toPortId);

      if (!distanceMap.has(key) || !pairsWithGeometry.has(key)) {
        missingPairs.push({ fromPortId, toPortId });
      }
    }
  }

  // Calculate missing distances and geometries
  const results = await Promise.all(
    missingPairs.map(async ({ fromPortId, toPortId }) => {
      const distanceNm = await getOrCalculatePortDistance(
        Number(fromPortId),
        Number(toPortId),
      );

      return { fromPortId, toPortId, distanceNm };
    }),
  );

  for (const result of results) {
    distanceMap.set(
      getPairKey(result.fromPortId, result.toPortId),
      result.distanceNm,
    );
  }

  return distanceMap;
};
