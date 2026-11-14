import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { getAllRouteStopsService } from '../services/route-stops.service';

export const getAllRouteStopsController = async (
  _: Request,
  res: Response,
) => {
  try {
    const routeStops = await getAllRouteStopsService();

    res.status(200).send(routeStops);
  } catch (error) {
    handleError(res, error);
  }
};