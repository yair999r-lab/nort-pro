
import type { VoyageInterface } from "@/voyages/types/voyages.types";

export const VOYAGES_MOCK: VoyageInterface[] = [
  {
    voyage_id: 1,
    ship_id: 101,
    origin_port_id: 1,
    destination_port_id: 4,
    planned_departure_at: "2026-10-30T06:00:00Z",
    actual_departure_at: null,
    estimated_arrival_at: "2026-11-03T10:00:00Z",
    actual_arrival_at: null,
    status: "planned",
  },
  {
    voyage_id: 2,
    ship_id: 103,
    origin_port_id: 1,
    destination_port_id: 4,
    planned_departure_at: "2026-10-20T06:00:00Z",
    actual_departure_at: "2026-10-20T06:25:00Z",
    estimated_arrival_at: "2026-10-25T10:00:00Z",
    actual_arrival_at: "2026-10-25T09:40:00Z",
    status: "completed",
  },
  {
    voyage_id: 3,
    ship_id: 102,
    origin_port_id: 2,
    destination_port_id: 4,
    planned_departure_at: "2026-10-27T08:00:00Z",
    actual_departure_at: "2026-10-27T08:15:00Z",
    estimated_arrival_at: "2026-10-30T12:00:00Z",
    actual_arrival_at: null,
    status: "in_progress",
  },
];
