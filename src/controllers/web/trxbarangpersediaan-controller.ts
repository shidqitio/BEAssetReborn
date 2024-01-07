import { Request, Response, NextFunction } from "express";
import { pakai_unit, status_pemakaian } from "../../models/trxpersediaandetail-model";
import CustomError, { IErrorResponse } from "../../middlewares/error-handler";
import trxBarangPersediaanService from "../../services/web/trxbarangpersediaan-service"
import { responseSuccess } from "../../utils/response-success";

export type ArrayOption<T> = (Array: T[]) => void;

export type BarangPromise = {
        kode_barang : string,
        nomor_dokumen : string,
        nama_barang : string,
        jumlah : any,
        harga_satuan : any,
        total : number,
        ucr : string
}

export type BarangExcelRequest = {
        kode_barang : string | null
        nama_barang : string | null
        jumlah : number | null
        harga_satuan : any
        total : any
        nomor_dokumen : string | null
        kode_barang_persediaan : string | null
        satuan : string | null
        tahun : string | null
        keterangan : string | null
        kuantitas : any
        kode_unit : string | null
        PersediaanDetail : []
}

export type BarangPromiseRequest = {
        nomor_dokumen : string,
        tanggal_dokumen : Date | undefined,
        kode_unit : string,
        status : string,
        tanggal_pembukuan : Date | undefined,
        ucr : string,
        alasan : Text | null, 
        nilai_total : number | null,
        BarangPromise : Array<BarangPromise>,
        PersediaanHeader : [],
}

export type BarangDetailRequest = {
        nomor_dokumen : string,
        kode_barang : string,
        kode_barang_persediaan : string,
        nama_barang : string,
        satuan : string,
        harga_satuan : number,
        tahun : string,
        keterangan : string,
        status_pemakaian : status_pemakaian,
        pakai_unit : pakai_unit,
        kuantitas : number,
        kode_unit : string,
        kode_gudang : number,
        ucr : string,
}

export type BarangDetailResponse = {
    nomor_dokumen : string,
    kode_barang : string,
    kode_barang_persediaan : string,
    nama_barang : string,
    satuan : string,
    harga_satuan : number,
    tahun : string,
    keterangan : string,
    status_pemakaian : status_pemakaian,
    kuantitas : number,
    kode_unit : string,
    kode_gudang : number,
    ucr : string,
}

export type BastResponse = {
     kode_persediaan : number | null;
	 nomor_dokumen : string;
	 nama_penyedia : string | null;
	 tanggal_dokumen : Date | undefined;
	 tanggal_pembukuan : Date | undefined;
	 nilai_total : number | null;
	 kode_unit : string;
	 status : number;
	 alasan : Text | null;
	 ucr : string | null;
	 uch : string | null;
	 udcr : Date | undefined;
	 udch : Date | undefined;
}

const getForm = async (
        req:Request,
        res:Response,
        next:NextFunction) : Promise<void> => {
        try {
            const request : BarangDetailRequest = req.body

            const [Barang,err] : [any, IErrorResponse] = await trxBarangPersediaanService.getForm(request)

            if(err){
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res,200,Barang)

        } catch (error) {
            next(error)
        }
}


const getBarangPromise =async (
        req:Request,
        res:Response,
        next:NextFunction) : Promise<void> => {
        try {
            const kode = req.params.id

            const [Bast, err] : [BastResponse, IErrorResponse] = await trxBarangPersediaanService.getBarangPromise(kode)

            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 200, Bast)
        } catch (error) {
                next(error)
        }
}

const getBarangPromiseProses =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void>=> {
    try {
        const kode = req.params.id
        const [Bast, err] : [BastResponse, IErrorResponse] = await trxBarangPersediaanService.getBarangPromiseProses(kode)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, Bast)
        
    } catch (error) {
        next(error)
    }
}

const storeDataPromise =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : BarangPromiseRequest = req.body

        const [createBast, err] : 
        [BastResponse, IErrorResponse] = await trxBarangPersediaanService.storeDataPromise(request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 201, createBast)
    } catch (error) {
        next(error)
    }
}

const detailBarang =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const request : BarangDetailRequest = req.body

            const [detail_barang, err] : [BarangDetailResponse, IErrorResponse] 
            = await trxBarangPersediaanService.detailBarang(request);

            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 201, detail_barang)
        } catch (error) {
            next(error)
        }
}

const detailBarangUnit =async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const request : BarangDetailRequest = req.body

            const [detail_barang, err] : [BarangDetailResponse, IErrorResponse] 
            = await trxBarangPersediaanService.detailBarangUnit(request);

            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 201, detail_barang)
        } catch (error) {
            next(error)
        }
}
    
const deleteBarang = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const request : BarangDetailRequest = req.body

            const [detail_barang, err] : [BarangDetailResponse, IErrorResponse] 
            = await trxBarangPersediaanService.deleteBarang(request);

            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 204, detail_barang)
        } catch (error) {
            next(error)
        }
}

const kirimKasubag = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const request : BarangDetailRequest = req.body

            const [bast, err] : [BastResponse, IErrorResponse] 
            = await trxBarangPersediaanService.detailBarangUnit(request);

            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 203, bast)
        } catch (error) {
            next(error)
        }
}

const tolakKasubag = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const request : BarangDetailRequest = req.body

            const [bast, err] : [BastResponse, IErrorResponse] 
            = await trxBarangPersediaanService.detailBarangUnit(request);

            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 203, bast)
        } catch (error) {
            next(error)
        }
}

const kasubagParaf = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const request : BarangDetailRequest = req.body

            const [detail_barang, err] : [BarangDetailResponse, IErrorResponse] 
            = await trxBarangPersediaanService.detailBarangUnit(request);

            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 203, detail_barang)
        } catch (error) {
            next(error)
        }
}

const pembelianUpload = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {    
        try {
            const request : any = req.body

            const [persediaan, err] : [BarangDetailResponse, IErrorResponse] 
            = await trxBarangPersediaanService.pembelianUpload(request);
            
            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 201, persediaan)
        } catch (error) {
            next(error)
        }
}

const BastBarangPersediaanExist =async (
    req:Request,
    res:Response,
    next:NextFunction) => {
    try {
        const kode_unit : string = req.params.kode_unit;

        const [BastBarang,err] : [BastResponse, IErrorResponse] = await trxBarangPersediaanService.BastBarangPersediaanExist(kode_unit)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 200, BastBarang)
    } catch (error) {
        next(error)
    }
}

const DetailBarangExist =async (
    req:Request,
    res:Response,
    next:NextFunction) => {
    try {
        const kode_barang : string =  req.params.kode_barang
        const kode_unit : string = req.params.kode_unit
        const nomor_dokumen : any = req.query.nomor_dokumen

        const [BarangDetail, err] : [BarangDetailResponse, IErrorResponse] = await trxBarangPersediaanService.DetailBarangExist(kode_barang,kode_unit,nomor_dokumen)

        if(err){
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res,200, BarangDetail)
    } catch (error) {
        next(error)
    }
}

export default {
    getForm,
    getBarangPromise,
    getBarangPromiseProses,
    storeDataPromise,
    detailBarang,
    detailBarangUnit,
    deleteBarang,
    kirimKasubag,
    tolakKasubag,
    kasubagParaf,
    pembelianUpload,
    BastBarangPersediaanExist,
    DetailBarangExist
}
