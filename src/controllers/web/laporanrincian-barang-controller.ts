import { Request, Response, NextFunction } from "express";
import CustomError, { IErrorResponse } from "../../middlewares/error-handler";
import { responseSuccess } from "../../utils/response-success";
import laporanRincianBarangService from "../../services/web/laporanrincian-barang-service";
import { pakai_unit, status_pemakaian } from "../../models/trxpersediaandetail-model";

export interface AssetPersediaanRequest {
	kode_barang: string,
	kode_barang_persediaan: string,
	nama_persediaan: string,
	satuan: string,
	ucr: string | null,
	uch: string | null,
}

export interface BarangDetailResponse {
	nomor_dokumen : string,
    kode_barang : string,
    kode_barang_persediaan : string,
    nama_barang : string,
    satuan : string,
    harga_satuan : number,
    tahun : string,
    keterangan : string,
    status_pemakaian : status_pemakaian,
	pakai_unit: pakai_unit,
    kuantitas : number,
    kode_unit : string,
    kode_gudang : number,
    ucr : string,
}

const getAll = async (
	req: Request,
	res: Response,
	next: NextFunction): Promise<void> => {
	try {

		const [assetpersediaan, err]: [BarangDetailResponse, IErrorResponse] = await laporanRincianBarangService.getAll();

		if (err) {
			throw new CustomError(err.code, err.message)
		}
		responseSuccess(res, 200, assetpersediaan)

	} catch (error) {
		next(error)
	}
}

const getByTahun = async (
	req: Request,
	res: Response,
	next: NextFunction): Promise<void> => {
	try {
		const tahun = req.params.tahun

		const [assetpersediaan, err]: [BarangDetailResponse, IErrorResponse] = await laporanRincianBarangService.getByTahun(tahun);

		if (err) {
			throw new CustomError(err.code, err.message)
		}
		responseSuccess(res, 200, assetpersediaan)

	} catch (error) {
		next(error)
	}
}

const getByUnit = async (
	req: Request,
	res: Response,
	next: NextFunction): Promise<void> => {
	try {
		const unit = req.params.kode_unit

		const [assetpersediaan, err]: [BarangDetailResponse, IErrorResponse] = await laporanRincianBarangService.getByTahun(unit);

		if (err) {
			throw new CustomError(err.code, err.message)
		}
		responseSuccess(res, 200, assetpersediaan)

	} catch (error) {
		next(error)
	}
}

const getAllSaldoAwal = async (
	req: Request,
	res: Response,
	next: NextFunction): Promise<void> => {
	try {
		
		const [saldoAwal, err]: [BarangDetailResponse, IErrorResponse] = await laporanRincianBarangService.getAllSaldoAwal();

		if (err) {
			throw new CustomError(err.code, err.message)
		}
		responseSuccess(res, 200, saldoAwal)

	} catch (error) {
		next(error)
	}
}

export default {
	getAll,
	getByTahun,
	getByUnit,
	getAllSaldoAwal
}