import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { getAllRouteVoyagesService } from '../services/route-voyages.service';

export const getAllRouteVoyagesController = async (
  _: Request,
  res: Response,
) => {
  try {
    const routeVoyages = await getAllRouteVoyagesService();

    res.status(200).send(routeVoyages);
  } catch (error) {
    handleError(res, error);
  }
};