import { Request, Response } from 'express';
import { handleError } from '@libs/global';

import { buildDynamicAllocationOptionsFromDatabaseService } from '../services/shipping.service';

import { confirmAllocationFromDatabaseService } from '../services/confirm-allocation.service';

export const getAllocationOptionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const shipmentId = req.params.shipmentId;

    if (typeof shipmentId !== 'string') {
      res.status(400).send({
        message: 'מזהה משלוח לא תקין',
      });
      return;
    }

    const options =
      await buildDynamicAllocationOptionsFromDatabaseService(shipmentId);

    if (options === null) {
      res.status(404).send({
        message: `המשלוח ${shipmentId} לא נמצא`,
      });
      return;
    }

    res.status(200).send(options);
  } catch (error) {
    handleError(res, error);
  }
};

export const confirmAllocationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const shipmentId = req.params.shipmentId;
    const shipId = req.body?.shipId;

    // בדיקת תקינות מזהה המשלוח והאונייה
    const isValidId = (value: unknown): boolean => {
      if (typeof value !== 'string' && typeof value !== 'number') {
        return false;
      }

      if (String(value).trim() === '') {
        return false;
      }

      const numericId = Number(value);

      return Number.isSafeInteger(numericId) && numericId > 0;
    };

    if (!isValidId(shipmentId) || !isValidId(shipId)) {
      res.status(400).send({
        message: 'מזהה משלוח או אונייה לא תקין',
      });
      return;
    }

    // ביצוע אישור ההקצאה
    const result = await confirmAllocationFromDatabaseService(
      String(shipmentId),
      String(shipId),
    );

    if (!result) {
      res.status(409).send({
        message:
          'לא ניתן לאשר את ההקצאה. ייתכן שהמשלוח כבר הוקצה או שהאפשרות אינה תקפה עוד. רענן את האפשרויות ונסה שוב.',
      });
      return;
    }

    res.status(200).send({
      message: 'ההקצאה נשמרה בהצלחה',
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
};
