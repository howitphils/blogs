import { HttpError } from "../../../core/middlewares/error-handling/custom-errors/http-error";
import { ErrorResponse } from "../../../core/types/error-response-types";
import { HttpStatus } from "../../../core/types/http-statuses";

export class UserNotFoundError extends HttpError {
  constructor() {
    super("User was not found", HttpStatus.NOT_FOUND);
    this.name = "UserNotFoundError";
  }
}

export class NotUniqueUserError extends HttpError {
  public errorResponse: ErrorResponse;

  constructor(field: string) {
    super("", HttpStatus.BAD_REQUEST);

    this.errorResponse = {
      errorsMessages: [{ field, message: `${field} should be unique` }],
    };
    this.name = "NotUniqueUserError";
  }
}
