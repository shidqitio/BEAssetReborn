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

export default {
    updateNup,
	barangbyId,
	ubahKondisiBarang
}