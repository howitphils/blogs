import { Router } from "express";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { container } from "../../../composition-root";
import { SessionsController } from "../controller/sessions-controller";

export const sessionsRouter = Router();
const sessionsController = container.get(SessionsController);

sessionsRouter.get(
  "/devices",
  checkUserInReq,
  sessionsController.getSessions.bind(sessionsController),
);

sessionsRouter.delete(
  "/devices",
  checkUserInReq,
  sessionsController.deleteAllSessions.bind(sessionsController),
);

sessionsRouter.delete(
  "/devices/:id",
  checkUserInReq,
  sessionsController.deleteSession.bind(sessionsController),
);
