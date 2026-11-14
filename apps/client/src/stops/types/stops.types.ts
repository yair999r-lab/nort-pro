
export type StopStatus =
  | "planned"
  | "approaching"
  | "arrived"
  | "departed"
  | "skipped";

export interface StopInterface {
  stop_id: number;
  voyage_id: number;
  port_id: number;
  sequence_number: number;
  estimated_arrival_at: string;
  actual_arrival_at: string | null;
  status: StopStatus;
}

export type NormalizedStop = {
  id: string;
  voyage_id: number;
  port_id: number;
  sequence_number: number;
  estimated_arrival_at: string;
  actual_arrival_at: string | null;
  status: StopStatus;
};
