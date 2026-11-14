export function calculateTravelTime(
  distanceNm: number,
  speedKnots: number,
): number | null {
  if (
    !Number.isFinite(distanceNm) ||
    distanceNm < 0 ||
    !Number.isFinite(speedKnots) ||
    speedKnots <= 0
  ) {
    return null;
  }

  return distanceNm / speedKnots;
}