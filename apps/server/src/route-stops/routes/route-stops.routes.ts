import express from 'express';

import { getAllRouteStopsController } from '../controllers/route-stops.controllers';

const router = express.Router();

router.get('/', getAllRouteStopsController);

export default router;