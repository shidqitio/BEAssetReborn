import { Request, Response, NextFunction, request } from "express";
import pembukuanService from "../../services/web/pembukuan-service";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";
import { DasarHarga, MetodePenyusutan } from "../../models/daftarbarang-model";
import laporanassetservice from "../../services/web/laporanasset-service";

export type AssetResponse = {
    kode_asset_4 : string,
    nama_asset_4:string
}

const LaporanAsset = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void>=> {
    try {
        let tanggal_awal = req.body.tanggal_awal
        let tanggal_akhir = req.body.tanggal_akhir
        const [Asset, err] : [AssetResponse, IErrorResponse] = await laporanassetservice.LaporanAsset(tanggal_awal, tanggal_akhir)
        
        responseSuccess(res, 200, Asset)
    } catch (error) {
        next(error)
    }
}

const LaporatAssetlvl5  = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void>=> {
    try {
        let tanggal_awal = req.body.tanggal_awal
        let tanggal_akhir = req.body.tanggal_akhir

        const [Asset, err] : [AssetResponse, IErrorResponse] = await laporanassetservice.LaporatAssetlvl5(tanggal_awal, tanggal_akhir)

        responseSuccess(res, 200, Asset)

    } catch (error) {
         next(error)
    }
}

const LaporanAssetLevel6 = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        let tanggal_awal = req.body.tanggal_awal
        let tanggal_akhir = req.body.tanggal_akhir

        const [Asset, err] : [AssetResponse, IErrorResponse] = await laporanassetservice.LaporanAssetLevel6(tanggal_awal, tanggal_akhir)

        responseSuccess(res, 200, Asset)
    } catch (error) {
        next(error)
    }
}


export default {
    LaporanAsset,
    LaporatAssetlvl5,
    LaporanAssetLevel6
}