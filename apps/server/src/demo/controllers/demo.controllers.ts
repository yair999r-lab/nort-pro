import { Request, Response } from "express";
import { getAllDemoService } from "../services/demo.service";
import { CustomError, handleError } from "@libs/global";

// this module handles permissions and response to the user
export const getAllDemoController = async (_: Request, res: Response) => {
  try {
    const demo = await getAllDemoService();
    res.send(demo);
  } catch (error) {
    handleError(res, error);
  }
};

// testing the custom error
export const testErrorController = async (_: Request, res: Response) => {
  try {
    throw new CustomError("השגיאה שלי", "HTTP", 403, "NO PERMISSION");
  } catch (error) {
    handleError(res, error);
  }
};
