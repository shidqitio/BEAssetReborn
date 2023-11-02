import { Response } from "express";

interface IResponseSuccess {
    code: number;
    status: string;
    data?: any;
}

const responseSuccess = (res : Response, code : number, data? : any) => {
    const response: IResponseSuccess = {
        code : code,
        status : "success",
        data : data
    }
    return res.json(response)
}

export {responseSuccess}