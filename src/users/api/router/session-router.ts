import { Router } from "express";
import { sessionsController } from "../controller/sessions-controller";
import { cookieAuthGuard } from "../../../core/middlewares/authentication/cookie-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";

export const sessionRouter = Router();

sessionRouter.get(
  "/devices",
  cookieAuthGuard,
  checkUserInReq,
  sessionsController.getSessions,
);

sessionRouter.delete(
  "/devices",
  cookieAuthGuard,
  checkUserInReq,
  sessionsController.deleteAllSessions,
);

sessionRouter.delete(
  "/devices/:id",
  cookieAuthGuard,
  checkUserInReq,
  sessionsController.deleteSession,
);
