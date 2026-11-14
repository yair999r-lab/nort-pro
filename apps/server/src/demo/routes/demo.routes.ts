// this module handles the routes of this feature and middlewares like auth
import express from "express";
import {
  getAllDemoController,
  testErrorController,
} from "../controllers/demo.controllers";

const router = express.Router();

router.get("/", getAllDemoController);
router.get("/error", testErrorController);

export default router;
