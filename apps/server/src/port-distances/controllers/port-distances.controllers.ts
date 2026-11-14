import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { getAllPortDistancesService } from '../services/port-distances.service';

export const getAllPortDistancesController = async (
  _: Request,
  res: Response,
) => {
  try {
    const distances = await getAllPortDistancesService();

    res.status(200).send(distances);
  } catch (error) {
    handleError(res, error);
  }
};