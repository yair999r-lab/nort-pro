import express from 'express';

import { getAllShipmentsController } from '../controllers/shipments.controllers';

const router = express.Router();

router.get('/', getAllShipmentsController);

export default router;