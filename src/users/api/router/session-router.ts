import { Router } from "express";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { container } from "../../../composition-root";
import { SessionsController } from "../controller/sessions-controller";

export const sessionRouter = Router();
const sessionsController = container.get(SessionsController);

sessionRouter.get(
  "/devices",
  checkUserInReq,
  sessionsController.getSessions.bind(sessionsController),
);

sessionRouter.delete(
  "/devices",
  checkUserInReq,
  sessionsController.deleteAllSessions.bind(sessionsController),
);

sessionRouter.delete(
  "/devices/:id",
  checkUserInReq,
  sessionsController.deleteSession.bind(sessionsController),
);
