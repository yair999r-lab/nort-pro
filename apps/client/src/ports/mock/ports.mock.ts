
import type { PortInterface } from "@/ports/types/ports.types";

export const PORTS_MOCK: PortInterface[] = [
  {
    port_id: 1,
    port_name: "נמל חיפה",
    longitude: 34.998,
    latitude: 32.819,
    status: "active",
  },
  {
    port_id: 2,
    port_name: "נמל אשדוד",
    longitude: 34.642,
    latitude: 31.829,
    status: "active",
  },
  {
    port_id: 3,
    port_name: "נמל ונציה",
    longitude: 12.3155,
    latitude: 45.4408,
    status: "active",
  },
  {
    port_id: 4,
    port_name: "Port Said",
    longitude: 32.3019,
    latitude: 31.2653,
    status: "inactive",
  },
];
