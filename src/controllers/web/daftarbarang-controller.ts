import { Request, Response, NextFunction, request } from "express";
import pembukuanService from "../../services/web/pembukuan-service";
import CustomError, {IErrorResponse} from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";
import { DasarHarga, MetodePenyusutan } from "../../models/daftarbarang-model";
import daftarbarangService from "../../services/web/daftarbarang-service";




export interface DaftarBarangRequest {
    kode_barang? : number,
	kode_pembukuan? : string,
	kode_asset_nup? : number,
	nup : string,
	kode_asset : string,
	merk : string,
	tanggal_perolehan? : Date | undefined,
	kode_ruang : number,
	kd_ruang : number,
	deskripsi : string,
	nilai_item : number,
	kondisi : string,
	optional_key : string,
	qr_kode : string,
	alasan : string,
	umur_ekonomis : string,
	dasar_harga : DasarHarga,
	metode_penyusutan : MetodePenyusutan,
}

export type DaftarBarangUpdate = {
    kode_asset_nup? : number,
	nup : string,
}


const updateNup =async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode = req.params.id

        const [daftarbarang, err] : [DaftarBarangRequest, IErrorResponse] = await daftarbarangService.updateNup(kode)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 200, {
			"message" : "Berhasil Memberikan Nup"
		})

        
    } catch (error) {
        next(error)
    }
}

const barangbyId =async (
	req : Request,
	res : Response, 
	next : NextFunction) : Promise <void> => {
	try {
		const kode = req.params.id

		const [Barang, err] : [DaftarBarangRequest,IErrorResponse] = await daftarbarangService.barangbyId(kode)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 200, Barang)

	} catch (error) {
		next(error)
	}
}

const ubahKondisiBarang =async (
	req:Request,
	res: Response,
	next: NextFunction) : Promise<void> => {
	try {
		const kode : string = req.params.id
		const request : DaftarBarangRequest = req.body 

		const [UbahBarang,err] : [DaftarBarangRequest,IErrorResponse] = await daftarbarangService.ubahKondisiBarang(kode, request)

		if(err) {
			throw new CustomError(err.code, err.message)
		}

		responseSuccess(res, 204, UbahBarang)
	} catch (error) {
		next(error)
	}
}

const detailBarangbyRuang =async (
	req:Request,
	res:Response,
	next:NextFunction) : Promise<void> => {
	try {
		const page:number = parseInt(req.query.page as string, 10) || 1; 
        const limit: number = parseInt(req.query.limit as string, 10) || 10;
		const kode : number = parseInt(req.params.id1)
		const status : number = parseInt(req.params.id2)
		const kode_unit :string = req.params.kode_unit

		const [DaftarBarang, err] : [DaftarBarangRequest,IErrorResponse] = 
		await daftarbarangService.detailBarangbyRuang(kode, kode_unit, status, page, limit)

		if(err) {
			throw new CustomError(err.code, err.message)
		}
		
		responseSuccess(res, 200, DaftarBarang)
	} catch (error) {
		next(error)
	}
}

const detailByBarang =async (
	req:Request,
	res:Response,
	next:NextFunction) : Promise<void> => {
	try {
		const page:number = parseInt(req.query.page as string, 10) || 1; 
        const limit: number = parseInt(req.query.limit as string, 10) || 10;
		const kode : string = req.params.id1
		const kode_unit :string = req.params.kode_unit

		const [DaftarBarang, err] : [DaftarBarangRequest,IErrorResponse] = 
		await daftarbarangService.detailByBarang(kode, kode_unit, page, limit)

		if(err) {
			throw new CustomError(err.code, err.message)
		}
		
		responseSuccess(res, 200, DaftarBarang)
	} catch (error) {
		next(error)
	}
}

const hitungKode4 =async (
	req:Request,
	res:Response,
	next:NextFunction) : Promise<void> => {
	try {
		const [totalAsset, err] : [any, IErrorResponse] = await daftarbarangService.hitungKode4()

        if(err){
            throw new CustomError(err.code, err.message)
        }

        responseSuccess(res,200,totalAsset)
	} catch (error) {
		next(error)
	}
}

export default {
    updateNup,
	barangbyId,
	ubahKondisiBarang,
	detailBarangbyRuang,
	detailByBarang,
	hitungKode4
}