import { HttpStatus } from "../../../types/http-status-types";
import { HttpError } from "./http-error";

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.name = "NotFoundError";
  }
}
