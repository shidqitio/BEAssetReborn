import { Request, Response, NextFunction } from "express";
import pembukuanService from "../../services/web/pembukuan-service";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";
import { DasarHarga, MetodePenyusutan } from "../../models/daftarbarang-model";
import { DaftarBarangRequest } from "./daftarbarang-controller";

export type ArrayOption<T> = (Array: T[]) => void;

export type PembukuanRequest = {
    no_sppa : string;
	kode_pembukuan : string;
	jumlah_barang : number;
	asal_perolehan : string;
	no_bukti_perolehan : string;
	tanggal_perolehan? : Date | undefined;
	tanggal_pembukuan? : Date | undefined;
	keterangan : string;
	total_nilai : number;
	pdf : string;
	ucr : string;
    uch : string;
    DaftarBarangRequest: Array<DaftarBarangRequest>;
}


export interface DaftarBarangResponse  {
    kode_barang? : number;
    kode_pembukuan? : string;
}

export type PembukuanResponse = {
    no_sppa : string;
	kode_pembukuan : string;
	jumlah_barang : number;
	asal_perolehan : string;
	no_bukti_perolehan : string;
	tanggal_perolehan? : Date | undefined;
	tanggal_pembukuan? : Date | undefined;
	keterangan : string;
	total_nilai : number;
	pdf : string;
	ucr : string;
    uch : string;
}

const getPembukuan =async (
    req:Request,
    res:Response,
    next:NextFunction) => {
    try {
        const page:number = parseInt(req.query.page as string, 10) || 1; 
        const limit: number = parseInt(req.query.limit as string, 10) || 10;

        const [pembukuan, err] : [PembukuanResponse, IErrorResponse] = await pembukuanService.getPembukuan(page,limit)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, pembukuan)
    } catch (error) {
        next(error)
    }
}

const storePembukuan =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request: PembukuanRequest = req.body

        const [pembukuan, err] : [PembukuanResponse, IErrorResponse] = 
        await pembukuanService.storePembukuan(request);
        
        if(err) {
            throw new CustomError(err.code, err.message);
        }

        const response : PembukuanResponse = {
            no_sppa : pembukuan.no_sppa,
            kode_pembukuan : pembukuan.kode_pembukuan,
            jumlah_barang : pembukuan.jumlah_barang,
            asal_perolehan : pembukuan.asal_perolehan,
            no_bukti_perolehan : pembukuan.no_bukti_perolehan,
            tanggal_perolehan : pembukuan.tanggal_perolehan,
            tanggal_pembukuan : pembukuan.tanggal_pembukuan,
            keterangan : pembukuan.keterangan,
            total_nilai : pembukuan.total_nilai,
            pdf : pembukuan.pdf,
            ucr : pembukuan.ucr,
            uch : pembukuan.uch
        }

        
        responseSuccess(res, 201, {
            "respon_pembukuan" : response
        })

    } catch (error) {
        next(error)
    }
}

const antrianNup =async (
    req:Request,
    res:Response,
    next:NextFunction) => {
    try {
        const [pembukuan, err] : [PembukuanResponse, IErrorResponse] = await pembukuanService.antrianNup()

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, pembukuan)

    } catch (error) {
        next(error)
    }
}

export default {
    getPembukuan,
    storePembukuan,
    antrianNup
}