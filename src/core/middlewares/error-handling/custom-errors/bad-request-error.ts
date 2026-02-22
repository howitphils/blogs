import { HttpStatus } from "../../../types/http-statuses";
import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
