import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { getAllShipsService } from '../services/ships.service';

export const getAllShipsController = async (
  _: Request,
  res: Response,
) => {
  try {
    const ships = await getAllShipsService();

    res.status(200).send(ships);
  } catch (error) {
    handleError(res, error);
  }
};