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

export type BarangPromiseNew = {
    kode_barang_persediaan : string,
    kuantitas : number,
    satuan : string | null,
    harga_satuan : number,
    harga_total : number,
    uch : string | null
}

export type RequestBarangPromise = {
    kode_barang_persediaan : string,
    kuantitas : number,
    satuan : string | null,
    harga_satuan : number,
    harga_total : number,
    uch : string | null
}

export type StoreBarangPromiseNew = {
        nomor_dokumen : string,
        nama_penyedia : string | null,
        tanggal_dokumen : Date | undefined,
        kode_unit : string,
        status : string,
        tanggal_pembukuan : Date | undefined,
        kode_persediaan : number,
        tahun : string,
        ucr : string,
        alasan : Text | null, 
        nilai_total : number | null,
        BarangPromise : Array<BarangPromiseNew>,
}

export type PenampungResponse = {
    nomor_dokumen : string;
	kode_barang : string | null;
	kode_urut : number;
	kode_barang_persediaan : string | null;
	tahun : string | null;
	kode_unit : string | null;
	harga_satuan : number | null;
    kuantitas : number | null;
	harga_total : number | null;
	uch : string | null;
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

const pembelianUpload2 = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {    
        try {
            const request : any = req.body

            const [persediaan, err] : [BarangDetailResponse, IErrorResponse] 
            = await trxBarangPersediaanService.pembelianUpload2(request);
            
            if(err) {
                throw new CustomError(err.code, err.message)
            }

            responseSuccess(res, 201, persediaan)
        } catch (error) {
            next(error)
        }
}

const pembelianUpload3 = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {    
        try {
            const request : any = req.body

            const [persediaan, err] : [BarangDetailResponse, IErrorResponse] 
            = await trxBarangPersediaanService.pembelianUpload3(request);
            
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

const DetailBarangExist2 =async (
    req:Request,
    res:Response,
    next:NextFunction) => {
    try {
        const kode_barang : string =  req.params.kode_barang
        const kode_unit : string = req.params.kode_unit
        const nomor_dokumen : any = req.query.nomor_dokumen

        const [BarangDetail, err] : [BarangDetailResponse, IErrorResponse] = await trxBarangPersediaanService.DetailBarangExist2(kode_barang,kode_unit,nomor_dokumen)

        if(err){
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res,200, BarangDetail)
    } catch (error) {
        next(error)
    }
}

const uploadFileBast =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const nomor_dokumen : any = req.query.nomor_dokumen

        const [bast, err] : [BastResponse, IErrorResponse] = await trxBarangPersediaanService.uploadFileBast(nomor_dokumen, req.file)

        if(err) {
            throw new CustomError(err.code, err.message)
        }
        
        responseSuccess(res, 202, bast)
    } catch (error) {
        next(error)
    }
}

const hapusBastByUnit =async (
    req:Request,
    res: Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode : string = req.params.kode

        const [Bast, err] : [BastResponse, IErrorResponse] = await trxBarangPersediaanService.hapusBastByUnit(kode)

        if(err){
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 204, Bast)
    } catch (error) {
        next(error)
    }
}


// ============================ FLOW IDEAL =================================

const storeDataPromiseNew = async (
    req:Request,
    res:Response,
    next:NextFunction) => {
    try {
        const request : StoreBarangPromiseNew = req.body

        const [store, err] : [BastResponse, IErrorResponse] = await trxBarangPersediaanService.storeDataPromiseNew(request)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 201, store)
    } catch (error) {
        next(error)
    }
}

const ubahKodeBarang = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise <void> => {
    try {
        const kode_urut : number = parseInt(req.params.kode_urut)
        const kode_barang_persediaan : Omit<RequestBarangPromise,
        "kuantitas" |
        "satuan" | 
        "harga_satuan" | 
        "harga_total"> = req.body
        const [trxPenampung, err] : [PenampungResponse, IErrorResponse] = await trxBarangPersediaanService.ubahKodeBarang(kode_urut, kode_barang_persediaan)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 202, trxPenampung)
    } catch (error) {
        next(error)
    }
}

const kirimKasubagNew = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise <void> => {
    try {
        const nomor_dokumen : any = req.query.nomor_dokumen

        const [trxbast, err] : [BastResponse, IErrorResponse] = await trxBarangPersediaanService.kirimKasubagNew(nomor_dokumen)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 202, trxbast)
    } catch (error) {
        next(error)
    }
}

const storeDataParafKasubag = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise <void> => {
    try {
        const nomor_dokumen : any = req.query.nomor_dokumen

        const [trxbarangpenampung, err] : [PenampungResponse, IErrorResponse] = await trxBarangPersediaanService.storeDataParafKasubag(nomor_dokumen)

        if(err) {
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res, 201, trxbarangpenampung)
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
    DetailBarangExist,
    uploadFileBast,
    hapusBastByUnit,
    pembelianUpload2,
    pembelianUpload3,
    DetailBarangExist2,
    //FLOW PROPER
    storeDataPromiseNew,
    ubahKodeBarang,
    kirimKasubagNew,
    storeDataParafKasubag,

}
