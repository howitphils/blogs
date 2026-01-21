export type FieldError = {
  field: string;
  message: string;
};

export type ErrorResponse = {
  errorsMessages: FieldError[];
};
