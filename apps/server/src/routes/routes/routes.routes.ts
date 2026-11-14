import express from 'express';

import { getAllRoutesController } from '../controllers/routes.controllers';

const router = express.Router();

router.get('/', getAllRoutesController);

export default router;