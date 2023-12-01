import {validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express"
const validate = (req : Request, res : Response, next : NextFunction) => {
  const errors : any = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    console.log(errors)
    error.message = errors
      .array()
      // .map((error : any) => error.msg)
      // .join(", ");
    throw error;
  }
  next();
};

export default validate
