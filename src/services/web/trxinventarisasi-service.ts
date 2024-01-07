import TrxInventarisasi, {JenisUsulan, Kondisi} from "../../models/trxinventarisasi-model";
import DaftarBarang from "../../models/daftarbarang-model";
import { TrxInventarisasiRequest } from "../../controllers/web/trxinventarisasi-controller";
import db from "../../config/database";
import { Op, QueryTypes } from "sequelize";
import RefRuang from "../../models/ruang-model";
import TrxPenyusutan from "../../models/trx_penyusutan-model";
import sequelize from "sequelize";
import { removeFile, removeFileName } from "../../utils/remove-file";
import dotenv from "dotenv"
import CustomError from "../../middlewares/error-handler";
dotenv.config()


const BarangDitemukan =async (
    nup : string ) : Promise<[any | null, any | null]> => {
    try {
        const exDaftarBarang : DaftarBarang | null = await DaftarBarang.findOne({
            where : {
                nup : nup 
            },
            attributes : {exclude : ["ucr","uch","udcr","udch"]}
        })
        if (!exDaftarBarang) {
            return [null, {code : 499, message : "Data Tidak Ditemukan"}]
        }

        exDaftarBarang.status_barang = 1

        await exDaftarBarang.save()

        return[exDaftarBarang, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const BarangTidakDitemukan =async (
    nup:string) : Promise<[any | null, any | null]> => {
        const t = await db.transaction()
        try {
            const exDaftarBarang : DaftarBarang | null = await DaftarBarang.findOne({
                where : {
                    nup : nup
                }
            })
            if(!exDaftarBarang) {
                return [null, {code : 499, message : "Data Tidak Ditemukan"}]
            }

            const exInventarisasi : TrxInventarisasi | null = await TrxInventarisasi.findOne({
                where : {
                    nup : nup
                }
            })

            if(exInventarisasi) { 
                return [null, {code: 499, message : "Data Sudah Ada"}]
            }

            const insertInventoris : TrxInventarisasiRequest = await TrxInventarisasi.create({
                kode_barang : exDaftarBarang.kode_barang,
                nup : exDaftarBarang.nup,
                kode_asset : exDaftarBarang.kode_asset,
                jenis_usulan : JenisUsulan.identifikasi,
                status : 0,
                kode_ruang : exDaftarBarang.kode_ruang,
                tanggal_perolehan : exDaftarBarang.tanggal_perolehan,
                merk : exDaftarBarang.merk,
                kondisi : exDaftarBarang.kondisi
            }, {
                transaction : t
            })
            if(!insertInventoris) {
                return [null, {code : 499, message : "Data Gagal Insert"}]
            }

            const updateStatusDaftarBarang = await TrxInventarisasi.update({
                status : 2
            }, {
                where : {
                    nup : nup
                }, 
                transaction : t
            })

            if(updateStatusDaftarBarang[0] === 0  ) {
                return [null, {code : 499, message : "Data Gagal Update"}]
            }
            await t.commit()

            return [insertInventoris, null]

        } catch (error : any) {
            return [null, {code : 500, message : error.message}]
        }
}

const viewInventarisasiBarang =async (
    jenis_usulan : string
    ) : Promise<[any | null, any | null]> => {
    try {
        const Inventarisasi : TrxInventarisasi[] = 
        await db.query(`SELECT a.nup, c.kode_unit, c.nama_ruang, 
        b.kode_asset, d.nama_asset,b.merk, b.nilai_item as nilai_perolehan, b.tanggal_perolehan
        FROM trx_inventarisasi a LEFT JOIN ref_daftar_barang b ON a.nup = b.nup 
        JOIN ref_ruang c ON a.kode_ruang = c.kode_ruang  JOIN ref_asset d ON a.kode_asset = d.kode_asset
        where jenis_usulan = :jenis_usulan
        `, {
            replacements : {jenis_usulan : jenis_usulan},
            type : QueryTypes.SELECT})

        if(Inventarisasi.length === 0) {
            return [null, {code : 499, message : "Tidak Ada Barang Inventarisasi"}]
        }

        return [Inventarisasi, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const detailBarangInventarisasi =async (
    nup:string)  : Promise<[any | null, any | null]> => {
    try {
        
        const Barang : DaftarBarang | null = await DaftarBarang.findOne({
            where : {
                nup : nup
            },
            include : [
                {
                    model : TrxPenyusutan,
                    as : "trxpenyusutan",
                    attributes : [
                        "nup",
                        "nilai_item",
                        "tanggal_penyusutan",
                        "nilai_susut",
                        "angka_penyusutan",
                        "penyusutan_ke",
                        "penyusutan"
                    ],
                    on : {
                        nup : sequelize.where(sequelize.col(`DaftarBarang.nup`),`=`, sequelize.col('TrxPenyusutan.nup'))
                    }
                },
                {
                    model : RefRuang, 
                    as : 'refruang'
                }
            ]
        })

        if(!DaftarBarang) {
            return[null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [Barang, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const BatalDitemukan =async (
    nup:string) :  Promise<[any | null, any | null]> => {
    const t = await db.transaction()
    try {
        const exDaftarBarang : DaftarBarang | null = await DaftarBarang.findOne({
            where : {
                nup : nup 
            },
            attributes : {exclude : ["ucr","uch","udcr","udch"]}
        })
        if (!exDaftarBarang) {
            return [null, {code : 499, message : "Data Tidak Ditemukan"}]
        }

        exDaftarBarang.status_barang = 0

        await exDaftarBarang.save({transaction :t})

        const destroy_data = await TrxInventarisasi.destroy({
            where : {
                nup : nup
            },
            transaction : t
        })

        if(!destroy_data){
            return [null, {code : 499, message : "Data Berhasil Dihapus"}]
        }
        

        await t.commit()
        
        return[exDaftarBarang, null]
    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

const TambahInventarisasi =
async (request:TrxInventarisasiRequest, file : any) :  Promise<[any | null, any | null]>  => {
    try {
        let PUBLIC_FILE_BARANG
        if(file && file.filename){
            PUBLIC_FILE_BARANG = `${process.env.HOST_ASSET}/${file.filename}`
        } 
        else {
            throw new CustomError(409,"Foto Tidak Ada")
        }

        console.log("TES ", PUBLIC_FILE_BARANG)
        const kondisiEnum: Kondisi = Kondisi[request.kondisi as keyof typeof Kondisi];
        
        const newDataInventarisasi : TrxInventarisasi = await TrxInventarisasi.create({
            kode_asset : request.kode_asset,
            jenis_usulan :  JenisUsulan.catatan,
            status : 0,
            kode_ruang : request.kode_ruang,
            tahun_perolehan : request.tahun_perolehan,
            merk : request.merk,
            file : PUBLIC_FILE_BARANG,
            kondisi : kondisiEnum,
            keterangan : request.keterangan
        })

        if(!newDataInventarisasi) {
            throw new CustomError(409, "Data Gagal Dibuat")
        }

        return [newDataInventarisasi, null]

    } catch (error : any) {
        if(error instanceof CustomError){
            if(file && file.path){
                await removeFile(file.path)
            }
            throw new CustomError(error.code, error.message)
        }
        else{
            throw new CustomError(500,error.message)
        }
    }

}


export default {
    BarangDitemukan, 
    BarangTidakDitemukan,
    BatalDitemukan,
    viewInventarisasiBarang,
    detailBarangInventarisasi,
    TambahInventarisasi
}