import { HttpStatus } from "../../../types/http-status-types";
import { HttpError } from "./http-error";

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
