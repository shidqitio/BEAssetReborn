import { Request, Response, NextFunction } from "express";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";
import assemasterService from "../../services/web/assemaster-service";

export interface RefAssetBaru3Response {
    kode_asset_2 : string,
    kode_asset_3 : string,
    uraian_bidang : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetBaru4Response {
    kode_coa_4 : string,
    kode_asset_3 : string,
    kode_asset4 : string,
    uraian_kelompok : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetBaru5Response{
    kode_coa_5 : string,
    kode_asset_4 : string,
    kode_asset_5 : string,
    uraian_sub_kelompok : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetBaru6Response {
    kode_coa_6 : string,
    kode_asset_5 : string,
    kode_asset_6 : string,
    uraian_sub_sub_kelompok : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetPersediaanResponse {
    kode_asset_6 : string,
    kode_barang_persediaan : string,
    nama_persediaan : string,
    satuan : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetBaru4Request {
    kode_coa_4 : string | null,
    kode_asset_3 : string | null,
    kode_asset_4 : string,
    uraian_kelompok : string | null
}

export interface RefAssetBaru5Request {
    kode_coa_5 : string | null,
    kode_asset_4 : string | null,
    kode_asset_5 : string,
    uraian_sub_kelompok : string | null
}

export interface RefAssetBaru6Request {
    kode_coa_6 : string | null,
    kode_asset_5 : string | null,
    kode_asset_6 : string,
    uraian_sub_sub_kelompok : string | null
}

export interface AssetPersediaanRequest {
    kode_asset_6 : string | null, 
    kode_barang_persediaan : string | null,
    nama_persediaan : string | null, 
    satuan : string | null
}

//GET BARANG
const RefAssetBaru3byId =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const [Asset, err] : [RefAssetBaru3Response, IErrorResponse] = await assemasterService.RefAssetBaru3byId()

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, Asset)
    } catch (error) {
        next(error)
    }
}

const RefAssetBaru4byId =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_3

        const [Asset, err] : [RefAssetBaru4Response, IErrorResponse] = await assemasterService.RefAssetBaru4byId(kode)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, Asset)
    } catch (error) {
        next(error)
    }
}

const RefAssetBaru5byId =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_4

        const [Asset, err] : [RefAssetBaru5Response, IErrorResponse] = await assemasterService.RefAssetBaru5byId(kode)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, Asset)
    } catch (error) {
        next(error)
    }
}

const RefAssetBaru6byId =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_5

        const [Asset, err] : [RefAssetBaru6Response, IErrorResponse] = await assemasterService.RefAssetBaru6byId(kode)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, Asset)
    } catch (error) {
        next(error)
    }
}

const RefAssetPersediaan =async ( 
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_6
        
        const [Asset, err] : [RefAssetBaru6Response, IErrorResponse] = await assemasterService.RefAssetPersediaan(kode)

        if(err){
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, Asset)

    } catch (error) {
        next(error)
    }
}


//POST BARANG
const AddAssetBaru4 =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_3
        const request : RefAssetBaru4Request = req.body

        const [Asset,err] : [RefAssetBaru4Response,IErrorResponse] = await assemasterService.AddAssetBaru4(kode, request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 201, Asset)
    } catch (error) {
        next(error)
    }
}

const AddAssetBaru5 =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_4
        const request : RefAssetBaru5Request = req.body

        const [Asset,err] : [RefAssetBaru5Response,IErrorResponse] = await assemasterService.AddAssetBaru5(kode, request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 201, Asset)
    } catch (error) {
        next(error)
    }
}

const AddAssetBaru6 =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_5
        const request : RefAssetBaru6Request = req.body

        const [Asset,err] : [RefAssetBaru6Response,IErrorResponse] = await assemasterService.AddAssetBaru6(kode, request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 201, Asset)
    } catch (error) {
        next(error)
    }
}

const AddAssetBaruPersediaan =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_6
        const request : AssetPersediaanRequest = req.body

        const [Asset, err] : [RefAssetPersediaanResponse, IErrorResponse] = await assemasterService.AddAssetBaruPersediaan(kode,request)

        responseSuccess(res,201, Asset)
    } catch (error) {
        next(error)
    }
}

const updateAssetBaru4 =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_4
        const request : RefAssetBaru4Request = req.body

        const [Asset, err] : [RefAssetBaru4Response, IErrorResponse] = await assemasterService.updateAssetBaru4(kode, request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res,202,Asset)
    } catch (error) {
        next(error)
    }
}

const updateAssetBaru5 =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_5
        const request : RefAssetBaru5Request = req.body

        const [Asset, err] : [RefAssetBaru5Response, IErrorResponse] = await assemasterService.updateAssetBaru5(kode, request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res,202,Asset)
    } catch (error) {
        next(error)
    }
}

const updateAssetBaru6 =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_asset_6
        const request : RefAssetBaru6Request = req.body

        const [Asset, err] : [RefAssetBaru6Response, IErrorResponse] = await assemasterService.updateAssetBaru6(kode, request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res,202,Asset)
    } catch (error) {
        next(error)
    }
}

const updateRefPersediaan =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode_barang_persediaan
        const request : AssetPersediaanRequest = req.body

        const [Asset, err] : [RefAssetPersediaanResponse, IErrorResponse] = await assemasterService.updateRefPersediaan(kode, request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res,202,Asset)
    } catch (error) {
        next(error)
    }
}

export default {
    RefAssetBaru3byId,
    RefAssetBaru4byId,
    RefAssetBaru5byId,
    RefAssetBaru6byId,
    RefAssetPersediaan,
    AddAssetBaru4,
    AddAssetBaru5,
    AddAssetBaru6,
    AddAssetBaruPersediaan,
    updateAssetBaru4,
    updateAssetBaru5,
    updateAssetBaru6,
    updateRefPersediaan,
}