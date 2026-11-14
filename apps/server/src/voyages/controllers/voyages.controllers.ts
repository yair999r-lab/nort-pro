import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { getAllVoyagesService } from '../services/voyages.service';

export const getAllVoyagesController = async (
  _: Request,
  res: Response,
) => {
  try {
    const voyages = await getAllVoyagesService();

    res.status(200).send(voyages);
  } catch (error) {
    handleError(res, error);
  }
};