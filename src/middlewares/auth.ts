import axios from "axios";
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express";
import CustomError from "./error-handler";
dotenv.config()

export type UserData = {
    auth : string,
    token : string,
    id_user : string,
    kode_group : string,
    api_token : string,
    is_login : string,
    kode_unit : string,
    nama_unit : string,
}

declare global {
    namespace Express {
      interface Request {
        user: UserData;
      }
    }
  }

const authenticate = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
        const id_user  = req.headers.id_user as string;
        const kode_group = req.headers.kode_group as string;
        const auth    = req.headers.token_lama as string || '';
        const token = req.headers.token_baru as string || '';

        if (!id_user || !kode_group || !auth || !token) {
            throw new CustomError(401, "Unauthorized")
            
          }
      
          if (auth?.split(" ")[0] !== "Bearer") {
            throw new CustomError(401, "Format auth salah, hubungi administrator untuk mengatasi masalah ini.")
          }
          try {
            const data = {
              id_user: id_user,
              kode_group: kode_group,
              token: token,
            };
      
            const response = await axios.post(
              `${process.env.HOST_USMAN}/check-token`,
              data,
              {
                headers: {
                  Authorization: `${auth}`,
                },
              }
            );
      
            const { status, message } = response.data;
            if (status !== "success") {
              throw new CustomError(401, "User not authenticated.")
            }
      
            const user = response.data.data;
            const respon = await axios.get(
              `${process.env.HOST_HRIS}/pegawai/email/${user.email}`, {
                headers : {
                  id_user :id_user,
                  kode_group : kode_group,
                  token_lama : auth,
                  token_baru : token,
                }
              }
            );
            const responsePegawai = respon.data;
            if (responsePegawai.status !== "Success") {
              throw new CustomError(404, `${responsePegawai.message}`)
            }
      
            const pegawai = responsePegawai.data;
            
            const userData : UserData = {
            auth: auth,
            token: token,
            id_user: user.id,
            kode_group: kode_group,
            api_token: user.api_token,
            is_login: user.is_login,
            kode_unit: pegawai.TrxUnitKerjaPegawais[0].Unit.kode_unit_baru,
            nama_unit: pegawai.TrxUnitKerjaPegawais[0].Unit.nama_unit,
            // ...pegawai,
            };

            req.user = userData

            next();
          } catch (err : any) {
            next(err);
          }
}

export default authenticate