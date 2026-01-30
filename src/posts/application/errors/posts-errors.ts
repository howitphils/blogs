import { HttpError } from "../../../core/middlewares/error-handling/custom-errors/http-error";
import { HttpStatus } from "../../../core/types/http-status-types";

export class PostNotFoundError extends HttpError {
  constructor() {
    super("Post was not found", HttpStatus.NOT_FOUND);
    this.name = "PostNotFoundError";
  }
}

export class PostNotFoundInternalError extends HttpError {
  constructor() {
    super("Post was not found", HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = "PostNotFoundInternalError";
  }
}
