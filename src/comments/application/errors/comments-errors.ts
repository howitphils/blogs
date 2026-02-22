import { HttpError } from "../../../core/middlewares/error-handling/custom-errors/http-error";
import { HttpStatus } from "../../../core/types/http-statuses";

export class CommentNotFoundError extends HttpError {
  constructor() {
    super("Comment was not found", HttpStatus.NOT_FOUND);
    this.name = "CommentNotFoundError";
  }
}
