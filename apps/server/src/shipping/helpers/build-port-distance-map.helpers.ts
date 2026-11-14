import type { AllocationPortDistance } from '../types/allocation.types';

const getPortPairKey = (
  fromPortId: string,
  toPortId: string,
): string => `${fromPortId}:${toPortId}`;

export const buildPortDistanceMap = (
  distances: AllocationPortDistance[],
): Map<string, number> => {
  const distanceMap = new Map<string, number>();

  for (const distance of distances) {
    const distanceNm = Number(distance.distanceNm);

    if (!Number.isFinite(distanceNm) || distanceNm <= 0) {
      continue;
    }

    const key = getPortPairKey(
      distance.fromPortId,
      distance.toPortId,
    );

    distanceMap.set(key, distanceNm);
  }

  return distanceMap;
};

export const getPortDistance = (
  distanceMap: Map<string, number>,
  fromPortId: string,
  toPortId: string,
): number | null => {
  if (fromPortId === toPortId) {
    return 0;
  }

  return (
    distanceMap.get(getPortPairKey(fromPortId, toPortId)) ?? null
  );
};