import { queryToPostgres } from '@libs/global';
import { selectPortByIdQuery } from '../helpers/ports.helpers';

import { selectAllPortsQuery } from '../helpers/ports.helpers';
import type { PortDbRow } from '../types/ports.db.types';

export const getAllPortsDAL = async (): Promise<PortDbRow[]> => {
  return queryToPostgres<PortDbRow, PortDbRow>(
    selectAllPortsQuery(),
  );
};

export const getPortByIdDAL = async (
  portId: number,
): Promise<PortDbRow | null> => {
  const rows = await queryToPostgres<
    { port_id: number },
    PortDbRow
  >(selectPortByIdQuery(), [portId]);

  return rows[0] ?? null;
};