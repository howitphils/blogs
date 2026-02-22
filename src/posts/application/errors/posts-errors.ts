import { HttpError } from "../../../core/middlewares/error-handling/custom-errors/http-error";
import { HttpStatus } from "../../../core/types/http-statuses";

export class PostNotFoundError extends HttpError {
  constructor() {
    super("Post was not found", HttpStatus.NOT_FOUND);
    this.name = "PostNotFoundError";
  }
}
