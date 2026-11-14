import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { getAllShipmentsService } from '../services/shipments.service';

export const getAllShipmentsController = async (
  _: Request,
  res: Response,
) => {
  try {
    const shipments = await getAllShipmentsService();

    res.status(200).send(shipments);
  } catch (error) {
    handleError(res, error);
  }
};