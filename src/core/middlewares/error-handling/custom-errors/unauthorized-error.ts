import { HttpStatus } from "../../../types/http-status-types";
import { HttpError } from "./http-error";

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}
