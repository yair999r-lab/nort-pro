import { queryToPostgres } from '@libs/global';

import {
  selectAllPortDistancesQuery,
  selectPortDistanceByPortsQuery,
  insertPortDistanceQuery,
  updatePortDistanceGeometryQuery,
} from '../helpers/port-distances.helpers';

import type {
  PortDistanceDbRow,
  PortRouteGeometry,
} from '../types/port-distances.db.types';

export const getAllPortDistancesDAL = async (): Promise<PortDistanceDbRow[]> => {
  return queryToPostgres<PortDistanceDbRow, PortDistanceDbRow>(
    selectAllPortDistancesQuery(),
  );
};

export const getPortDistanceByPortsDAL = async (
  fromPortId: number,
  toPortId: number,
): Promise<PortDistanceDbRow | null> => {
  const rows = await queryToPostgres<
    { from_port_id: number; to_port_id: number },
    PortDistanceDbRow
  >(selectPortDistanceByPortsQuery(), [fromPortId, toPortId]);

  return rows[0] ?? null;
};

export const insertPortDistanceDAL = async (
  fromPortId: number,
  toPortId: number,
  distanceNm: number,
  source: string,
  geometry: PortRouteGeometry,
): Promise<PortDistanceDbRow | null> => {
  const rows = await queryToPostgres<
    {
      from_port_id: number;
      to_port_id: number;
      distance_nm: number;
      distance_source: string;
      route_geometry: PortRouteGeometry;
    },
    PortDistanceDbRow
  >(insertPortDistanceQuery(), [
    fromPortId,
    toPortId,
    distanceNm,
    source,
    geometry,
  ]);

  return rows[0] ?? null;
};

export const updatePortDistanceGeometryDAL = async (
  fromPortId: number,
  toPortId: number,
  geometry: PortRouteGeometry,
): Promise<boolean> => {
  const rows = await queryToPostgres<
    {
      from_port_id: number;
      to_port_id: number;
      route_geometry: PortRouteGeometry;
    },
    PortDistanceDbRow
  >(updatePortDistanceGeometryQuery(), [
    fromPortId,
    toPortId,
    geometry,
  ]);

  return rows.length > 0;
};