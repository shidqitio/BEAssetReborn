import db from "../../config/database"
import RefAssetBaru4 from "../../models/refassetbaru4-model"
import RefAsset from "../../models/asset-model"
import DaftarBarang from "../../models/daftarbarang-model"
import sequelize from "sequelize"
import { Op,QueryTypes } from "sequelize"

const LaporanAsset = async (tanggal_awal : string, tanggal_akhir : string) : Promise<[any | null, any | null]> => {
    try {
    
        const refAsset4 : RefAssetBaru4[] = await db.query(`Select * FROM ref_asset_baru_4 where kode_asset_4 LIKE '121%'`, {
            type : QueryTypes.SELECT
        })
       
        const jumlahBertambah : DaftarBarang[] = await db.query(`
        SELECT a.kode_asset, a.nama_asset, a.satuan, COALESCE(bb.kuantitas, 0) AS kuantitas, COALESCE(bb.nilai, 0) AS nilai FROM ref_asset a 
        LEFT JOIN 
        (SELECT b.nama_asset, b.satuan, b.kode_asset, COUNT(a.kode_barang) as kuantitas,
        SUM(a.nilai_item) as nilai
        FROM ref_daftar_barang a JOIN ref_asset b ON a.kode_asset = b.kode_asset  
        WHERE tanggal_perolehan BETWEEN :tanggal_awal AND :tanggal_akhir GROUP BY kode_asset) bb
        ON a.kode_asset = bb.kode_asset
        LEFT JOIN 
        (
        SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_angkutan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana BETWEEN :tanggal_awal AND :tanggal_akhir GROUP BY a.kode_asset
        UNION 
        SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_bangunan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana BETWEEN :tanggal_awal AND :tanggal_akhir GROUP BY a.kode_asset
        UNION
        SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_jembatan_jaringan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana BETWEEN :tanggal_awal AND :tanggal_akhir GROUP BY a.kode_asset
        ) cc
        ON a.kode_asset = cc.kode_asset
        `, {
            replacements : {
                tanggal_awal : tanggal_awal,
                tanggal_akhir : tanggal_akhir
            },
            type : QueryTypes.SELECT
        })

        const jumlahAwal : DaftarBarang[] = await db.query(`
        SELECT a.kode_asset, a.nama_asset, a.satuan,COALESCE(bb.kuantitas, 0) + COALESCE(cc.kuantitas, 0) AS kuantitas, COALESCE(bb.nilai, 0) + COALESCE(cc.nilai, 0) AS nilai FROM ref_asset a 
        LEFT JOIN 
        (SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.kode_barang) as kuantitas, 
        SUM(a.nilai_item) as nilai
        FROM ref_daftar_barang a JOIN ref_asset b ON a.kode_asset = b.kode_asset  
        WHERE tanggal_perolehan < :tanggal_awal GROUP BY kode_asset) bb
        ON a.kode_asset = bb.kode_asset
        LEFT JOIN 
        (SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_angkutan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana < :tanggal_awal GROUP BY a.kode_asset
        UNION
        SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_bangunan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana < :tanggal_awal GROUP BY a.kode_asset
        UNION
        SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_jembatan_jaringan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana < :tanggal_awal GROUP BY a.kode_asset) cc 
        ON a.kode_asset = cc.kode_asset 
        `, {
            replacements : {
                tanggal_awal : tanggal_awal
            },
            type : QueryTypes.SELECT
        })

        const jumlahAkhir : DaftarBarang[] = await db.query(`     
        SELECT a.kode_asset, a.nama_asset, a.satuan,COALESCE(bb.kuantitas, 0) AS kuantitas, COALESCE(bb.nilai, 0) AS nilai FROM ref_asset a 
        LEFT JOIN 
        (SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.kode_barang) as kuantitas, 
        SUM(a.nilai_item) as nilai
        FROM ref_daftar_barang a JOIN ref_asset b ON a.kode_asset = b.kode_asset  
        WHERE tanggal_perolehan <= '2023-06-31' GROUP BY kode_asset) bb
        ON a.kode_asset = bb.kode_asset
        LEFT JOIN 
        (
        #kibAngkutan
        SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_angkutan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana <= :tanggal_akhir GROUP BY a.kode_asset
        UNION 
        #KibJembatan
        SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_jembatan_jaringan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana <= :tanggal_akhir GROUP BY a.kode_asset
        UNION
        #kibBangunan
        SELECT b.nama_asset, b.satuan, a.kode_asset, COUNT(a.no_asset) as kuantitas, 
        SUM(a.harga_satuan) AS nilai
        FROM trx_kib_bangunan a JOIN ref_asset b ON a.kode_asset = b.kode_asset
        WHERE tanggal_dana <= :tanggal_akhir GROUP BY a.kode_asset
        ) cc
        ON a.kode_asset = cc.kode_asset
        `, {
            replacements : {
                tanggal_akhir : tanggal_akhir
            },
            type : QueryTypes.SELECT
        })

        // console.log(SaldoAwal)

        const array_hasil = refAsset4.map((item) => {
            const hasilSaldoAwal = jumlahAwal.filter((subSaldo) => {
                return subSaldo.kode_asset.toString().startsWith(item.kode_asset_4.toString())
            })
            const hasilTambah = jumlahBertambah.filter((subTambah) => {
                return subTambah.kode_asset.toString().startsWith(item.kode_asset_4.toString())
            })

            const hasilAkhir = jumlahAkhir.filter((subAkhir) => {
                return subAkhir.kode_asset.toString().startsWith(item.kode_asset_4.toString())
            })
            return {
                ...item, hasilSaldoAwal, hasilTambah, hasilAkhir
            }
        })

        return [array_hasil, null]

    } catch (error : any) {
        console.log(error)
        return [null, {code : 500, message : error.message}]
    }
}

// const LaporanAssetPenyusutan = async (tanggal_awal:string, tanggal_akhir:string) : Promise <[any | null, any | null]> => {
//     try {
        
//     } catch (error) {
        
//     }
// }

export default {
    LaporanAsset
}