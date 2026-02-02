import { HttpError } from "../../../core/middlewares/error-handling/custom-errors/http-error";
import { HttpStatus } from "../../../core/types/http-status-types";

export class UserNotFoundError extends HttpError {
  constructor() {
    super("User was not found", HttpStatus.NOT_FOUND);
    this.name = "UserNotFoundError";
  }
}

export class UserNotFoundInternalError extends HttpError {
  constructor() {
    super("User was not found", HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = "UserNotFoundInternalError";
  }
}
