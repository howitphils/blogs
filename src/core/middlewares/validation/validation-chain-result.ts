import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  validationResult,
  ValidationError,
} from "express-validator";
import { FieldError } from "../../types/errors-types";
import { HttpStatus } from "../../types/http-status-types";

const errorFormatter = (error: ValidationError): FieldError => {
  if (error.type === "field") {
    const fieldError = error as FieldValidationError;
    return {
      field: fieldError.path,
      message: error.msg,
    };
  } else {
    return {
      field: "unknown",
      message: error.msg,
    };
  }
};

export const validationChainResult = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const formatedErrors = validationResult(req)
    .formatWith(errorFormatter)
    .array({ onlyFirstError: true });

  if (formatedErrors.length > 0) {
    res.status(HttpStatus.BAD_REQUEST).json({ errorsMessages: formatedErrors });
    return;
  }

  next();
};
