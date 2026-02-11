import { HttpStatus } from "../../../types/http-status-types";
import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
