const SAFETY_BUFFER_HOURS = 24;

export function isArrivalOnTime(
  arrivalAt: string,
  requiredArrival: string
): boolean {

  const estimatedTime = Date.parse(arrivalAt);
  const requiredTime = Date.parse(requiredArrival);

  if (
    Number.isNaN(estimatedTime) ||
    Number.isNaN(requiredTime)
  ) {
    return false;
  }

  const latestAllowedArrival =
    requiredTime - SAFETY_BUFFER_HOURS * 60 * 60 * 1000;

  return estimatedTime <= latestAllowedArrival;
}