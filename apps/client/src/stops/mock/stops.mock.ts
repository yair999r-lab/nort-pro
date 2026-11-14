
import type { StopInterface } from "@/stops/types/stops.types";

export const STOPS_MOCK: StopInterface[] = [
  {
    stop_id: 1,
    voyage_id: 1,
    port_id: 2,
    sequence_number: 1,
    estimated_arrival_at: "2026-10-31T09:00:00Z",
    actual_arrival_at: null,
    status: "planned",
  },
  {
    stop_id: 2,
    voyage_id: 2,
    port_id: 2,
    sequence_number: 1,
    estimated_arrival_at: "2026-10-22T06:00:00Z",
    actual_arrival_at: "2026-10-22T06:20:00Z",
    status: "departed",
  },
  {
    stop_id: 3,
    voyage_id: 3,
    port_id: 4,
    sequence_number: 1,
    estimated_arrival_at: "2026-10-30T12:00:00Z",
    actual_arrival_at: null,
    status: "approaching",
  },
];
