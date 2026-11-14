import { queryToPostgres } from '@libs/global';

import { selectAllShipsQuery } from '../helpers/ships.helpers';
import type { ShipDbRow } from '../types/ships.db.types';

export const getAllShipsDAL = async (): Promise<ShipDbRow[]> => {
  return queryToPostgres<ShipDbRow, ShipDbRow>(
    selectAllShipsQuery(),
  );
};