import { HttpError } from "../../../core/middlewares/error-handling/custom-errors/http-error";
import { HttpStatus } from "../../../core/types/http-statuses";

export class SessionNotFoundError extends HttpError {
  constructor() {
    super("Session was not found", HttpStatus.NOT_FOUND);
    this.name = "SessionNotFoundError";
  }
}
