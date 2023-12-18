import { Request, Response, NextFunction } from "express";
import { responseSuccess } from "../../utils/response-success";
import reklasifikasiService from "../../services/web/reklasifikasi-service";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";

export type ReklasifikasiRequest = {
    trx_barang_persediaan : string,
	tanggal_rekam? : Date | undefined,
	kode_barang_persediaan_awal : number,
	kode_barang_persediaan_baru : number,
	keterangan : string,
	status : string,
	ucr : string,
	uch : string,
	udcr : Date | undefined,
	udch : Date | undefined,
}

export type ReklasifikasiResponse = {
	trx_barang_persediaan : string
	tanggal_rekam : Date | undefined,
	kode_barang_persediaan_awal : number,
	kode_barang_persediaan_baru : number,
	keterangan : string,
	status : string,
	ucr : string,
	uch : string,
	udcr : Date | null,
	udch : string | null,
}

const getReklasifikasi = async (
    req:Request,
    res:Response,
    next:NextFunction
    ) : Promise<void> => {
    try {
        const reklasifikasi = await reklasifikasiService.getReklasifikasi()

        // console.log(reklasifikasi);
        // if(err) {
        //     throw new Error("Gagal fetch data")
        // }

        responseSuccess(res, 200, reklasifikasi)

    } catch (error) {
        next(error)
    }
}

const storeReklasifikasi = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
    try {
        const request : ReklasifikasiRequest = req.body

        const [reklasifikasi, err] : [ReklasifikasiResponse, IErrorResponse] = await reklasifikasiService.storeReklasifikasi(request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, reklasifikasi)
    } catch (error) {
        next(error)
    }
}

const deleteReklasifikasi = async (
    req : Request,
    res : Response,
    next : NextFunction
    ) : Promise<void> => {
    try {
        const trx_barang_persediaan : number = parseInt(req.params.trx_barang_persediaan)

        const [reklasifikasi, err] : [ReklasifikasiResponse, IErrorResponse] = await reklasifikasiService.deleteReklasifikasi(trx_barang_persediaan)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, reklasifikasi)
    } catch (error) {
        next(error)
    }
}

const updateReklasifikasi =async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const trx_barang_persediaan : number = parseInt(req.params.trx_barang_persediaan)
        const request : any = req.body
        // console.log(request);


        const [reklasifikasi, err] : [ReklasifikasiRequest, IErrorResponse] = await reklasifikasiService.updateReklasifikasi(trx_barang_persediaan, request)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 200, {
            "message" : "Berhasil update reklasifikasi"
		})

        
    } catch (error) {
        next(error)
    }
}

// const getAssetById =async (
//     req:Request,
//     res:Response,
//     next:NextFunction) : Promise<void> => {
//     try {
//         const kode : string = req.params.id

//         const [asset, err] : [AssetResponse, IErrorResponse] = await assetService.getAssetById(kode)

//         if(err) {
//             throw new CustomError(err.code, err.message)
//         }

//         responseSuccess(res, 200, asset)
//     } catch (error) {
//         next(error)
//     }
// }

// const getAssetByNama =async (
//     req:Request,
//     res:Response,
//     next:NextFunction) : Promise<void> => {
//     try {
//         const nama_asset : string = req.params.id

//         const [assets,err] : [AssetResponse[], IErrorResponse] = await assetService.getAssetByNama(nama_asset)

//         if(err) {
//             throw new CustomError(err.code, err.message)
//         }

//         responseSuccess(res, 200, assets)
//     } catch (error) {
//         next(error)
//     }
// }

export default {
    getReklasifikasi,
    storeReklasifikasi,
    deleteReklasifikasi,
    updateReklasifikasi
}