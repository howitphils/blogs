import { Router } from "express";
import { testingController } from "../controller/testing-controller";

export const testingRouter = Router();

testingRouter.delete("/all-data", testingController.resetDatabase);
