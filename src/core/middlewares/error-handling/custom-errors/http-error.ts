import { HttpStatus } from "../../../types/http-statuses";

export class HttpError extends Error {
  public status: HttpStatus;

  constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}
