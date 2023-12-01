import {Response, Request, NextFunction } from "express";
import { errorLogger } from "../config/logger";

export interface IErrorResponse {
    code : number;
    status? : string;
    message : string;
}

export default class CustomError extends Error implements IErrorResponse {
    readonly status: string;

    constructor(public code: number, public message: string) {
        super(message) ;
        this.status = "error";
        this.message = message;
    }
}

export const errorhandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    errorLogger.error(error)
    if (error instanceof CustomError) {
      return res
        .status(error.code)
        .json({ code: error.code, status: "error", message: error.message });
    } else {
      return res
        .status(500)
        .json({ code: 500, status: "error", error: [
          {
            message : error.message
          }
        ]});
    }
  };
  