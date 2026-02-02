import { HttpError } from "../../../core/middlewares/error-handling/custom-errors/http-error";
import { ErrorResponse } from "../../../core/types/error-response-types";
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

export class NotUniqueUserError extends HttpError {
  errorObj: ErrorResponse;

  constructor(field: string) {
    super("", HttpStatus.BAD_REQUEST);

    this.errorObj = {
      errorsMessages: [{ field, message: `${field} should be unique` }],
    };
  }
}
