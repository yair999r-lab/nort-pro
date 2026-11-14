
import type {
  NormalizedStop,
  StopInterface,
} from "@/stops/types/stops.types";

export const normalizeStop = (
  stop: StopInterface
): NormalizedStop => {
  const {
    stop_id,
    voyage_id,
    port_id,
    sequence_number,
    estimated_arrival_at,
    actual_arrival_at,
    status,
  } = stop;

  return {
    id: String(stop_id),
    voyage_id,
    port_id,
    sequence_number,
    estimated_arrival_at,
    actual_arrival_at,
    status,
  };
};

export const normalizeStops = (
  stops: StopInterface[]
): NormalizedStop[] => stops.map(normalizeStop);
