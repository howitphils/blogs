import { HttpStatus } from "../../../types/http-statuses";
import { HttpError } from "./http-error";

export class ServerError extends HttpError {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
