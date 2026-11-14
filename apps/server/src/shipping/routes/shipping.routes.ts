import express from 'express';

import {
  getAllocationOptionsController,
  confirmAllocationController,
} from '../controllers/shipping.controllers';

const router = express.Router();

// קבלת כל נתוני השילוח
router.get('/', getAllocationOptionsController);

// קבלת אפשרויות הקצאה למשלוח
router.get(
  '/shipments/:shipmentId/allocation-options',
  getAllocationOptionsController,
);

// אישור הקצאה
router.post(
  '/shipments/:shipmentId/allocate',
  confirmAllocationController,
);

export default router;