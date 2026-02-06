import { HttpError } from "../../../core/middlewares/error-handling/custom-errors/http-error";
import { HttpStatus } from "../../../core/types/http-status-types";

export class BlogNotFoundError extends HttpError {
  constructor() {
    super("Blog was not found", HttpStatus.NOT_FOUND);
    this.name = "BlogNotFoundError";
  }
}
