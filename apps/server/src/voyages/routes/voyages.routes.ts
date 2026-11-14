import express from 'express';

import { getAllVoyagesController } from '../controllers/voyages.controllers';

const router = express.Router();

router.get('/', getAllVoyagesController);

export default router;