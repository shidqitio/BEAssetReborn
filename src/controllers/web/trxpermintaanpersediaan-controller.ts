import { jasa_ekspedisi, status_aktif, jenis_permintaan } from "../../models/trxpermintaanpersediaanheader-model";
import { status_tolak } from "../../models/trxpermintaanpersediaandetail-model";


export interface TrxPermintaanHeaderRequest {
	 kode_unit : string,
	 nama_unit : string,
	 jasa_ekspedisi : jasa_ekspedisi,
	 nama_ekspedisi : string,
	 no_resi : string,
	 paraf_kasubag : string,
	 tahun : string,
	 status : number,
	 status_aktif : status_aktif,
	 jenis_permintaan : jenis_permintaan,
	 ucr : string,
	 uch : string,
}

export interface TrxPermintaanDetailRequest {
	kode_barang_persediaan : string,
	nama_barang_persediaan : string,
	jumlah : number,
	jumlah_disetujui : number,
	satuan : string,
	keterangan : string,
	status_tolak : status_tolak,
	alasan : string,
	ucr : string,
	uch : string,
}