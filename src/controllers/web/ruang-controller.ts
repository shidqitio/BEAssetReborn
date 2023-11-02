import { Request, Response, NextFunction } from "express";
import { responseSuccess } from "../../utils/response-success";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import RefRuang from "../../models/ruang-model";
import ruangService from "../../services/web/ruang-service";


export type RuangRequest = {
    kode_ruang : number
	kd_ruang : string | null,
	nip : string,
	nama_pj : string,
	kode_unit : string,
	nama_unit : string,
	nama_ruang : string,
	ucr : string,
	uch : string,
	udcr : Date | null,
	udch : string | null,
}

export type RuangResponse = {
	// kode_ruang : number,
    kd_ruang : string | null,
	nip : string,
	nama_pj : string,
	kode_unit : string,
	nama_unit : string,
	nama_ruang : string,
	ucr : string,
	uch : string,
	udcr : Date | null,
	udch : string | null,
}


const getRuangAll =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const page:number = parseInt(req.query.page as string, 10) || 1; 
        const limit: number = parseInt(req.query.limit as string, 10) || 10;

        const [ruang, err] : [RuangResponse[], IErrorResponse] = await ruangService.getRuangAll(page, limit)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, ruang)
    } catch (error) {
        next(error)
    }
}

const getRuangByUnit =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode = req.params.id

        const [ruang, err] : [RuangResponse, IErrorResponse] = await ruangService.getRuangByUnit(kode)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, ruang)

    } catch (error) {
        next(error)
    }
}

const storeRuang =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : RuangRequest = req.body

        const [ruang, err] : [RuangResponse, IErrorResponse] = await ruangService.storeRuang(request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, ruang)
    } catch (error) {
        next(error)
    }
}


const updateRuang =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode:number = parseInt(req.params.id)

        const request : Omit<RuangRequest, "kode_ruang"> = req.body

        const [ruang, err] : [RuangResponse, IErrorResponse] = await ruangService.updateRuang(kode,request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        const response : RuangResponse = {
            kd_ruang : ruang.kd_ruang,
            nip : ruang.nip,
            nama_pj : ruang.nama_pj,
            kode_unit : ruang.kode_unit,
            nama_unit : ruang.nama_unit,
            nama_ruang : ruang.nama_ruang,
            ucr : ruang.ucr,
            uch : ruang.uch,
            udcr : ruang.udcr,
            udch : ruang.udch,
        }

        responseSuccess(res, 200, response)
    } catch (error) {
        next(error)
    }
}

const deleteRuang =async (
    req : Request,
    res : Response,
    next : NextFunction
    ) : Promise<void> => {
    try {
        const kode : number = parseInt(req.params.id)

        const [ruang, err] : [RuangResponse, IErrorResponse] = await ruangService.deleteRuang(kode)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, ruang)
    } catch (error) {
        next(error)
    }
}

export default {
    storeRuang,
    getRuangByUnit, 
    getRuangAll,
    updateRuang,
    deleteRuang
}