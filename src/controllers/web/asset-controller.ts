import { Request, Response, NextFunction } from "express";
import assetService from "../../services/web/asset-service";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";

export type AssetResponse = {
    kode_bidang : string;
	kode_kartu : string;
	kode_asset : string;
	nama_asset : string;
};

const getRefAsset =async (
    req:Request,
    res:Response,
    next:NextFunction
    ) : Promise<void> => {
    try {
        const page:number = parseInt(req.query.page as string, 10) || 1; 
        const limit: number = parseInt(req.query.limit as string, 10) || 10;

        const [assets, err] : [AssetResponse, IErrorResponse] = await assetService.getRefAsset(page, limit)
        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, assets)

    } catch (error) {
        next(error)
    }
}

const getAssetById =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.id

        const [asset, err] : [AssetResponse, IErrorResponse] = await assetService.getAssetById(kode)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, asset)
    } catch (error) {
        next(error)
    }
}

const getAssetByNama =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const nama_asset : string = req.params.id

        const [assets,err] : [AssetResponse[], IErrorResponse] = await assetService.getAssetByNama(nama_asset)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, assets)
    } catch (error) {
        next(error)
    }
}

export default {
    getRefAsset,
    getAssetById,
    getAssetByNama
}