import type { RouteSegment } from '../helpers/route-segments.helpers';

export interface ScheduledSegment extends RouteSegment {
  departureAt: string;
  arrivalAt: string;
  carriesShipment: boolean;
}

export interface ShipSchedule {
  segments: ScheduledSegment[];
  arrivalAtOrigin: string;
  arrivalAtDestination: string;
  repositionDistanceNm: number;
  shipmentDistanceNm: number;
  totalDistanceNm: number;
  totalHomePortStops: number;
}