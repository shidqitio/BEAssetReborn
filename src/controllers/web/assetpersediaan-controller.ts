import { Request, Response, NextFunction } from "express";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";
import assetpersediaanService from "../../services/web/assetpersediaan-service";


export interface AssetPersediaanRequest {
    kode_asset : string,
	kode_barang_persediaan : string,
	nama_persediaan : string,
	satuan : string,
	ucr : string | null,
	uch : string | null,
}

export interface AssetPersediaanResponse {
    kode_asset : string,
	kode_barang_persediaan : string,
	nama_persediaan : string,
	satuan : string,
	ucr : string | null,
	uch : string | null,
    udcr? : Date | undefined,
	udch? : Date | undefined,
}

const getAll =async (
	req : Request,
	res : Response, 
	next : NextFunction) : Promise<void> => {
	try {
		const [assetpersediaan, err] : [AssetPersediaanResponse, IErrorResponse] = await assetpersediaanService.getAll();

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 200, assetpersediaan)

	} catch (error) {
		next(error)
	}
}

const getById =async (
	req :Request,
	res : Response, 
	next : NextFunction) : Promise <void> => {
	try {
		const kode = req.params.id

		const [assetpersediaan, err] : [AssetPersediaanResponse, IErrorResponse] = await assetpersediaanService.getById(kode)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 200, assetpersediaan)

	} catch (error) {
		next(error)
	}
}

const createAsset =async (
	req:Request,
	res:Response,
	next:NextFunction) : Promise<void> => {
	try {
		const request : AssetPersediaanRequest = req.body

		const [assetpersediaan, err] : [AssetPersediaanResponse, IErrorResponse] 
		= await assetpersediaanService.createAsset(request)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 201, assetpersediaan)
	} catch (error) {
		next(error)
	}
}

const updateAsset =async (
	req:Request,
	res:Response,
	next:NextFunction) : Promise<void> => {
	try {
		const kode : string = req.params.id

		const request : Omit<AssetPersediaanRequest, "kode_barang_persediaan"> = req.body

		const [asset_persediaan, err] : [AssetPersediaanResponse, IErrorResponse] = await assetpersediaanService.updateAsset(kode,request)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		const response : AssetPersediaanResponse = {
		kode_asset : asset_persediaan.kode_asset,
		kode_barang_persediaan : asset_persediaan.kode_barang_persediaan,
		nama_persediaan : asset_persediaan.nama_persediaan,
		satuan : asset_persediaan.satuan,
		ucr : asset_persediaan.ucr,
		uch : asset_persediaan.uch,
    	udcr : asset_persediaan.udcr,
		udch : asset_persediaan.udch,
		}

		responseSuccess(res, 202, response)
	} catch (error) {
		next(error)
	}
}

const hapusAssetPersediaan =async (
	req:Request,
	res:Response,
	next:NextFunction) : Promise<void> => {
	try {
		const kode : string = req.params.id

		const [asset_persediaan, err] : [AssetPersediaanResponse, IErrorResponse] = await assetpersediaanService.hapusAssetPersediaan(kode)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 203, asset_persediaan)
	} catch (error) {
		next(error)
	}
}

export default {
	getAll,
	getById,
	createAsset,
	updateAsset,
	hapusAssetPersediaan,
}