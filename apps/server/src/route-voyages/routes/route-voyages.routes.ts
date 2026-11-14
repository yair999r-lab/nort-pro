import express from 'express';

import { getAllRouteVoyagesController } from '../controllers/route-voyages.controllers';

const router = express.Router();

router.get('/', getAllRouteVoyagesController);

export default router;