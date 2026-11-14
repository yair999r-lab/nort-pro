import express from 'express';

import { getAllPortDistancesController } from '../controllers/port-distances.controllers';

const router = express.Router();

router.get('/', getAllPortDistancesController);

export default router;