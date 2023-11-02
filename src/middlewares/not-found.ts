import { Request, Response, NextFunction } from "express";
import { IErrorResponse } from "./error-handler";

const notFound = (
    req : Request, 
    res : Response, 
    next : NextFunction
): Response => {
    const response: IErrorResponse = {
        code : 404,
        status : "error",
        message : `Dan jika kamu membalas, maka balaslah dengan (balasan) yang sama dengan siksaan yang ditimpakan kepadamu. Tetapi jika kamu bersabar, sesungguhnya itulah yang lebih baik bagi orang yang sabar QS An Nahl:126`
    };
    return res.json(response)
}

export {notFound}