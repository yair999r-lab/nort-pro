import { queryToPostgres } from '@libs/global';

import {
  selectAllVoyagesQuery,
  increaseVoyageLoadQuery,
  insertVoyageQuery,
} from '../helpers/voyages.helpers';

import type { VoyageDbRow } from '../types/voyages.db.types';

import type {
  VoyageToInsert,
  InsertedVoyageRow,
} from '../types/voyages.db.types';

export const getAllVoyagesDAL = async (): Promise<VoyageDbRow[]> => {
  return queryToPostgres<VoyageDbRow, VoyageDbRow>(selectAllVoyagesQuery());
};

export const insertVoyageDAL = async (
  voyage: VoyageToInsert,
): Promise<number | null> => {
  const rows = await queryToPostgres<
    VoyageToInsert,
    InsertedVoyageRow
  >(insertVoyageQuery(), [
    voyage.ship_id,
    voyage.origin_port_id,
    voyage.destination_port_id,
    voyage.distance_nm,
    voyage.departure_date,
    voyage.estimated_arrival,
    voyage.current_load_weight_kg,
  ]);

  return rows[0]?.voyage_id ?? null;
};

export const increaseVoyageLoadDAL = async (
  voyageId: number,
  addedWeightKg: number,
): Promise<boolean> => {
  const rows = await queryToPostgres<
    { voyage_id: number; added_weight_kg: number },
    InsertedVoyageRow
  >(increaseVoyageLoadQuery(), [
    voyageId,
    addedWeightKg,
  ]);

  return rows.length > 0;
};