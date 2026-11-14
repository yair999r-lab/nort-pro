import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { getAllPortsService } from '../services/ports.service';

export const getAllPortsController = async (
  _: Request,
  res: Response,
) => {
  try {
    const ports = await getAllPortsService();

    res.status(200).send(ports);
  } catch (error) {
    handleError(res, error);
  }
};