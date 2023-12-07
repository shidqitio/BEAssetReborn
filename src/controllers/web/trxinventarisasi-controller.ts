import { Request, Response, NextFunction } from "express";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";
import trxinventarisasiService from "../../services/web/trxinventarisasi-service"
import { DaftarBarangRequest } from "./daftarbarang-controller";

export type TrxInventarisasiRequest = {
	kode_barang? : number | null
    kode_asset? : string | null
	nup? : string | null
	nup_barang_baru? : string | null
	jenis_usulan? : string | null
	komentar? : string | null
	status? : number | null
	kode_ruang? :number | null
	tahun_perolehan? : string | null
    tanggal_perolehan? : Date | null
	merk? : string | null
	kondisi? : string | null
	keterangan? : string | null
	ucr? : string | null
	uch? : string | null
}

export type TrxInventarisasiResponse = {
    kode_trx_inventarisasi? : number
    kode_asset? : string | null
	kode_barang? : number | null
	nup? : string | null
	nup_barang_baru? : string | null
	jenis_usulan? : string | null
	komentar? : string | null
	status? : number | null
	kode_ruang? :number | null
	tahun_perolehan? : string | null
    tanggal_perolehan? : Date | null
	merk? : string | null
	kondisi? : string | null
	keterangan? : string | null
	ucr? : string | null
	uch? : string | null
	udcr? : Date | undefined
	udch? : Date | undefined
}

const viewInventarisasiBarang =async (
    req : Request,
    res : Response, 
    next : NextFunction
) : Promise<void> => {
    try {
        const [inventarisasi, err] : [TrxInventarisasiResponse, IErrorResponse] 
        = await trxinventarisasiService.viewInventarisasiBarang()

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess( res,200, inventarisasi)
    } catch (error) {
        next(error)
    }
}

const BarangDitemukan =async (
    req:Request,
    res:Response,
    next : NextFunction
    ) : Promise<void> => {
    try {
        const nup : string = req.params.nup

        const [Inventarisasi, err] : [TrxInventarisasiResponse, IErrorResponse] 
        = await trxinventarisasiService.BarangDitemukan(nup)
        
        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 203, Inventarisasi)
    } catch (error) {
        next(error)
    }
}

const BarangTidakDitemukan =async (
    req:Request, 
    res:Response,
    next:NextFunction) => {
    try {
        const nup : string = req.params.nup

        const [Inventarisasi, err] : [TrxInventarisasiResponse, IErrorResponse] 
        = await trxinventarisasiService.BarangTidakDitemukan(nup)
        
        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 203, Inventarisasi)
    } catch (error) {
        next(error)
    }
}

const detailBarangInventarisasi =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const nup : string = req.params.nup

        const [DaftarBarang,err] : [DaftarBarangRequest, IErrorResponse] = await trxinventarisasiService.detailBarangInventarisasi(nup)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, DaftarBarang)
    } catch (error) {
        next(error)
    }
}


export default {
    viewInventarisasiBarang, 
    BarangDitemukan, 
    BarangTidakDitemukan,
    detailBarangInventarisasi
}