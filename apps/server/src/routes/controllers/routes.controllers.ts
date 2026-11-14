import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { getAllRoutesService } from '../services/routes.service';

export const getAllRoutesController = async (
  _: Request,
  res: Response,
) => {
  try {
    const routes = await getAllRoutesService();

    res.status(200).send(routes);
  } catch (error) {
    handleError(res, error);
  }
};