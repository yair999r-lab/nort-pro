import express from 'express';

import { getAllPortsController } from '../controllers/ports.controllers';

const router = express.Router();

router.get('/', getAllPortsController);

export default router;