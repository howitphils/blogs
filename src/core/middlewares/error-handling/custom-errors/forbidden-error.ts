import { HttpStatus } from "../../../types/http-statuses";
import { HttpError } from "./http-error";

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
