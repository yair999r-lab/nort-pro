import express, { Request, Response } from "express";
const router = express.Router();

import demoRouts from "./demo/routes/demo.routes";
import ordersRouts from "./orders/routes/orders.routes";
import shippingRoutes from "./shipping/routes/shipping.routes";
import portsRoutes from './ports/routes/ports.routes';
import shipsRoutes from './ships/routes/ships.routes';
import routesRoutes from './routes/routes/routes.routes';
import routeStopsRoutes from './route-stops/routes/route-stops.routes';
import routeVoyagesRoutes from './route-voyages/routes/route-voyages.routes';
import voyagesRoutes from './voyages/routes/voyages.routes';
import shipmentsRoutes from './shipments/routes/shipments.routes';
import portDistancesRoutes from './port-distances/routes/port-distances.routes';


router.use("/demo", demoRouts);
router.use("/orders", ordersRouts);
router.use("/shipping", shippingRoutes)
router.use('/ports', portsRoutes);
router.use('/ships', shipsRoutes);
router.use('/routes', routesRoutes);
router.use('/route-stops', routeStopsRoutes);
router.use('/route-voyages', routeVoyagesRoutes);
router.use('/voyages', voyagesRoutes);
router.use('/shipments', shipmentsRoutes);
router.use('/port-distances', portDistancesRoutes);

router.use("/", (_: Request, res: Response) => {
  res.status(404).send("לא נמצא נקודת הקצה");
});

export default router;
