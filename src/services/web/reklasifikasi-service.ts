import { ReklasifikasiRequest } from "../../controllers/web/reklasifikasi-controller";
import TrxReklasifikasi from "../../models/reklasifikasi-model";

const getReklasifikasi =async ()  : Promise<TrxReklasifikasi[]>  => {
    try {
        const reklasifikasi : TrxReklasifikasi[] = await TrxReklasifikasi.findAll({
            attributes : {exclude : ['udcr','udch']},
        })
        return reklasifikasi
    } catch (error : any) {
        throw new Error("Failed to retrieve all")
    }
}

const storeReklasifikasi = async (
    request : ReklasifikasiRequest
) : Promise<[any | null, any | null]>   => {
    try {
         const newReklasifikasi : TrxReklasifikasi = await TrxReklasifikasi.create({
            trx_barang_persediaan : request.trx_barang_persediaan,
            tanggal_rekam : request.tanggal_rekam,
            kode_barang_persediaan_awal : request.kode_barang_persediaan_awal,
            kode_barang_persediaan_baru : request.kode_barang_persediaan_baru,
            keterangan : request.keterangan,
            status : request.status,
            ucr : request.ucr,
            uch : request.uch,
         })

         if(!newReklasifikasi) {
            return [null, {code : 409, message : "Data Gagal Ditambahkan"}]
         }

         return [newReklasifikasi, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

// const getRuangByUnit =async (
//     kode:string) : Promise<[any | null, any | null]> => {
//     try {
//         const ruang : RefRuang[] = await RefRuang.findAll({
//             attributes : {exclude : ['udcr','udch']},
//             where : {
//                 kode_unit : kode
//             },
//             include : [
//                 {
//                     model : DaftarBarang,
//                     as : "daftarbarang", 
//                     attributes : {exclude : ["udcr", "udch"]}
//                 }
//             ]
//         })

//         if(ruang.length === 0) {
//             return [null, {code : 409, message : "Data Tidak Ada"}]
//         }

//         return [ruang, null]
//     } catch (error : any) {
//         return [null, {code : 500, message : error.message}]
//     }
// }


const updateReklasifikasi =async (trx_barang_persediaan:number, request:ReklasifikasiRequest) : Promise<[any | null, any | null]> => {
    try {
        // console.log(trx_barang_persediaan);
        const reklasifikasi : TrxReklasifikasi | null = await TrxReklasifikasi.findByPk(trx_barang_persediaan)

        if(!reklasifikasi) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        reklasifikasi.trx_barang_persediaan =request.trx_barang_persediaan;
        reklasifikasi.tanggal_rekam =request.tanggal_rekam;
        reklasifikasi.kode_barang_persediaan_awal =request.kode_barang_persediaan_awal;
        reklasifikasi.kode_barang_persediaan_baru =request.kode_barang_persediaan_baru;
        reklasifikasi.keterangan =request.keterangan;
        reklasifikasi.status =request.status;
        reklasifikasi.ucr =request.ucr;
        reklasifikasi.uch =request.uch;
        reklasifikasi.udcr =request.udcr;
        reklasifikasi.udch =request.udch;

        const response = await reklasifikasi.save()
        if(!response) {
            return [null, {code : 400, message : "Data Gagal Update"}]
        }

        return [reklasifikasi, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const deleteReklasifikasi =async (
    trx_barang_persediaan:number) : Promise<[any | null, any | null]> => {
    try {
        const reklasifikasi : TrxReklasifikasi | null = await TrxReklasifikasi.findByPk(trx_barang_persediaan)

        if(!reklasifikasi) {
            return [null, {code : 401, message : "Data Tidak Ada"}]
        }

        const destroyResult = await TrxReklasifikasi.destroy({
            where : {
                trx_barang_persediaan : trx_barang_persediaan
            }
        })

        if(!destroyResult){
            return [null, {code : 400, message : "Data Gagal Dihapus"}]
        }

        return [destroyResult, null]
    } catch (error : any) { 
        return[null, {code : 500, message : error.message}]
    }
}

// const assetByRuang =async (
//     kode:string) : Promise<[any | null, any | null]> => {
//         try {
//             const ruang : RefRuang[] = await RefRuang.findAll({
//                 attributes : {exclude : ['udcr','udch']},
//                 where : {
//                     kode_ruang : kode
//                 },
//                 include : [
//                     {
//                         model : DaftarBarang,
//                         as : "daftarbarang", 
//                         attributes : {exclude : ["udcr", "udch"]}
//                     }
//                 ]
//             })
    
//             if(ruang.length === 0) {
//                 return [null, {code : 409, message : "Data Tidak Ada"}]
//             }
    
//             return [ruang, null]
//         } catch (error : any) {
//             return [null, {code : 500, message : error.message}]
//         }
// }



export default {
    getReklasifikasi,
    storeReklasifikasi,
    deleteReklasifikasi,
    updateReklasifikasi
}

