import { Router } from "express";
import { sessionsController } from "../controller/sessions-controller";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";

export const sessionRouter = Router();

sessionRouter.get("/devices", checkUserInReq, sessionsController.getSessions);

sessionRouter.delete(
  "/devices",
  checkUserInReq,
  sessionsController.deleteAllSessions,
);

sessionRouter.delete(
  "/devices/:id",
  checkUserInReq,
  sessionsController.deleteSession,
);
