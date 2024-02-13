import { usulan } from "../../models/trxrequestpemakaian-model";
import { Request, Response, NextFunction } from "express";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";
import trxrequestpemakaianService from "../../services/web/trxrequestpersediaan-service"

export interface TrxRequestPemakaianRequest {
	tanggal_pemakaian : Date | undefined
	nip : string | null
	kode_unit : string | null
	nama_pengusul : string | null
	kode_barang_persediaan : string | null
	usulan : usulan | null
	jumlah : number | null
	jumlah_disetujui : number | null
	keterangan : string | null
	alasan : string | null
	status : number | null
	ucr : string | null
}

export interface RequestPemakaianExcel {
    request_pemakaian : []
}

export interface TrxRequestPemakaianResponse {
    kode_pemakaian : string | null
	tanggal_pemakaian : Date | undefined
	nip : string | null
	kode_unit : string | null
	nama_pengusul : string | null
	kode_barang_persediaan : string | null
	usulan : usulan | null
	jumlah : number | null
	jumlah_disetujui : number | null
	keterangan : string | null
	alasan : string | null
	status : number | null
	ucr : string | null
	uch : string | null
	udcr : string | null
	udch : string | null
}


const excelPemakaian =async (
	req:Request,
	res : Response,
	next : NextFunction) : Promise<void> => {
	try {
		const request = req.body
		const [pemakaian, err] : [TrxRequestPemakaianResponse, IErrorResponse] = await trxrequestpemakaianService.excelPemakaian(request)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 201, pemakaian)
	} catch (error) {
		next(error)
	}
}

const excelPemakaian2 =async (
	req:Request,
	res : Response,
	next : NextFunction) : Promise<void> => {
	try {
		const request = req.body
		const [pemakaian, err] : [TrxRequestPemakaianResponse, IErrorResponse] = await trxrequestpemakaianService.excelPemakaian2(request)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 201, pemakaian)
	} catch (error) {
		next(error)
	}
}

const excelPemakaian3 =async (
	req:Request,
	res : Response,
	next : NextFunction) : Promise<void> => {
	try {
		const request = req.body
		const [pemakaian, err] : [TrxRequestPemakaianResponse, IErrorResponse] = await trxrequestpemakaianService.excelPemakaian3(request)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 201, pemakaian)
	} catch (error) {
		next(error)
	}
}

const getRequestPemakaian = async (
	req:Request,
	res : Response,
	next : NextFunction) : Promise<void> => {
	try {
		let kode = req.params.id
		const [pakai, err] : [TrxRequestPemakaianResponse, IErrorResponse] = await trxrequestpemakaianService.getRequestPemakaian(kode)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 200, pakai)
	} catch (error) {
		next(error)
	}
}

const getRequestPemakaian2 = async (
	req:Request,
	res : Response,
	next : NextFunction) : Promise<void> => {
	try {
		let kode = req.params.id
		const [pakai, err] : [TrxRequestPemakaianResponse, IErrorResponse] = await trxrequestpemakaianService.getRequestPemakaian2(kode)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 200, pakai)
	} catch (error) {
		next(error)
	}
}

const hapusPemakaian =async (
	req:Request,
	res : Response,
	next : NextFunction) : Promise<void> => {
	try {
		const kode : string = req.params.kode

		const [request, err] : [TrxRequestPemakaianResponse, IErrorResponse] = await trxrequestpemakaianService.hapusPemakaian(kode)

		if(err){
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 204, request)

	} catch (error) {
		next(error)
	}
}

const hapusPemakaian2 = async (
	req:Request,
	res:Response,
	next : NextFunction) => {
	try {
		const kode_unit : string = req.params.kode_unit

		const [request, err] : [TrxRequestPemakaianResponse, IErrorResponse] = await trxrequestpemakaianService.hapusPemakaian2(kode_unit)

		
		if(err){
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 204, request)
	} catch (error) {
		next(error)
	}
}

export default {
	excelPemakaian,
	getRequestPemakaian,
	hapusPemakaian, 
	excelPemakaian2,
	excelPemakaian3,
	getRequestPemakaian2,
	hapusPemakaian2
}