import type { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

class HttpError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message);
    this.status = status;
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string) {
    super(401, message);
    this.name = "Unauthorized";
  }
}

// From https://tsoa-community.github.io/docs/error-handling.html
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      error: err.name,
      message: err.message,
    });
  }

  if (err instanceof Error) {
    console.error(`Error ${req.path}`, err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }

  next();
};
