import { Request, Response } from 'express';
import {
  getAllOrdersService,
  getNewOrderLinesService,
  syncNewOrdersService,
} from '../services/orders.service';
import { handleError } from '@libs/global';
import { resetAndSyncOrdersService } from '../services/reset-and-sync-orders.service';

export const getAllOrdersController = async (_: Request, res: Response) => {
  try {
    const orders = await getAllOrdersService();
    res.send(orders);
  } catch (error) {
    handleError(res, error);
  }
};

export const getNewOrderLinesController = async (_: Request, res: Response) => {
  try {
    const orderLines = await getNewOrderLinesService();
    res.send(orderLines);
  } catch (error) {
    handleError(res, error);
  }
};

export const syncNewOrdersController = async (_: Request, res: Response) => {
  try {
    const result = await syncNewOrdersService();
    res.status(200).send(result);
  } catch (error) {
    handleError(res, error);
  }
};

export const resetAndSyncOrdersController = async (
  _: Request,
  res: Response
) => {
  try {
    const result = await resetAndSyncOrdersService();
    res.status(200).send(result);
  } catch (error) {
    handleError(res, error);
  }
};