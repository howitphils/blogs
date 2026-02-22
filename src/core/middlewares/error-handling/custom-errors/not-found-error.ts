import { HttpStatus } from "../../../types/http-statuses";
import { HttpError } from "./http-error";

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.name = "NotFoundError";
  }
}
