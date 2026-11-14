// this module handles the routes of this feature and middlewares like auth
import express from 'express';
import {
  getAllOrdersController,
  getNewOrderLinesController,
  syncNewOrdersController,
  resetAndSyncOrdersController
} from '../controllers/orders.controllers';

const router = express.Router();
router.get('/', getAllOrdersController);
router.get('/new-lines', getNewOrderLinesController);
router.post('/sync', syncNewOrdersController);
router.post('/reset-and-sync', resetAndSyncOrdersController);

export default router;
