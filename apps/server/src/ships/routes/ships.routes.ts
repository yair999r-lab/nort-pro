import express from 'express';

import { getAllShipsController } from '../controllers/ships.controllers';

const router = express.Router();

router.get('/', getAllShipsController);

export default router;