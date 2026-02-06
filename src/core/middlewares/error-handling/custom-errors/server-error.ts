import { HttpStatus } from "../../../types/http-status-types";
import { HttpError } from "./http-error";

export class ServerError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
