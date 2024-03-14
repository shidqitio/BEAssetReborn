import db from "../../config/database"
import RefAssetBaru4 from "../../models/refassetbaru4-model"
import RefAsset from "../../models/asset-model"
import DaftarBarang from "../../models/daftarbarang-model"
import sequelize from "sequelize"
import { Op,QueryTypes } from "sequelize"
import RefAssetBaru5 from "../../models/refassetbaru5-model"
import RefAssetBaru6 from "../../models/refassetbaru6-model"

//Laporan 
const LaporanAsset = async (tanggal_awal : string, tanggal_akhir : string) : Promise<[any | null, any | null]> => {
    try {
  
        const refAsset4 : RefAssetBaru4[] = await db.query(`Select * FROM ref_asset_baru_4 where kode_asset_4 LIKE '12%'`, {
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
        SELECT a.kode_asset, a.nama_asset, a.satuan,COALESCE(bb.kuantitas, 0) + COALESCE(cc.kuantitas, 0) AS kuantitas, COALESCE(bb.nilai, 0) + COALESCE(cc.nilai, 0) AS nilai 
        FROM ref_asset a  
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

const LaporatAssetlvl5 = async (tanggal_awal : string, tanggal_akhir : string) : Promise<[any | null, any | null]> => {
    try {
        const refAsset5 : RefAssetBaru5[] = await db.query(`Select * FROM ref_asset_baru_5 where kode_asset_5 LIKE '12%'`, {
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
        SELECT a.kode_asset, a.nama_asset, a.satuan,COALESCE(bb.kuantitas, 0) + COALESCE(cc.kuantitas, 0) AS kuantitas, COALESCE(bb.nilai, 0) + COALESCE(cc.nilai, 0) AS nilai 
        FROM ref_asset a  
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

        const array_hasil = refAsset5.map((item) => {
            const hasilSaldoAwal = jumlahAwal.filter((subSaldo) => {
                return subSaldo.kode_asset.toString().startsWith(item.kode_asset_5.toString())
            })
            const hasilTambah = jumlahBertambah.filter((subTambah) => {
                return subTambah.kode_asset.toString().startsWith(item.kode_asset_5.toString())
            })

            const hasilAkhir = jumlahAkhir.filter((subAkhir) => {
                return subAkhir.kode_asset.toString().startsWith(item.kode_asset_5.toString())
            })
            return {
                ...item, hasilSaldoAwal, hasilTambah, hasilAkhir
            }
        })

        return [array_hasil, null]

    } catch (error : any ) {
        return [null, {code : 500, message : error.message}]
    }
}

const LaporanAssetLevel6 = async (tanggal_awal : string, tanggal_akhir : string) : Promise <[any | null, any | null]> => {
    try {
        const refAsset6 : RefAssetBaru6[] = await db.query(`Select * FROM ref_asset_baru_6 where kode_asset_6 LIKE '12%'`, {
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
        SELECT a.kode_asset, a.nama_asset, a.satuan,COALESCE(bb.kuantitas, 0) + COALESCE(cc.kuantitas, 0) AS kuantitas, COALESCE(bb.nilai, 0) + COALESCE(cc.nilai, 0) AS nilai 
        FROM ref_asset a  
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

        const array_hasil = refAsset6.map((item) => {
            const hasilSaldoAwal = jumlahAwal.filter((subSaldo) => {
                return subSaldo.kode_asset.toString().startsWith(item.kode_asset_6.toString())
            })
            const hasilTambah = jumlahBertambah.filter((subTambah) => {
                return subTambah.kode_asset.toString().startsWith(item.kode_asset_6.toString())
            })

            const hasilAkhir = jumlahAkhir.filter((subAkhir) => {
                return subAkhir.kode_asset.toString().startsWith(item.kode_asset_6.toString())
            })
            return {
                ...item, hasilSaldoAwal, hasilTambah, hasilAkhir
            }
        })

        return [array_hasil, null]
    } catch (error : any ) {
        return [null, {code : 500, message : error.message}]
    }
}

//LAPORAN PENYUSUTAN
// const LaporanAssetPenyusutan = async (tanggal_awal:string, tanggal_akhir:string) : Promise <[any | null, any | null]> => {
//     try {
//         //Penyusutan Saldo Awal
//         const  saldoAwal = await db.query(`
//         #SALDO AWAL
//             SELECT aa.kode_asset, SUM(aa.nilai_susut) AS saldo_awal
//             FROM 
//             (
//             SELECT a.kode_asset,t1.* 
//             FROM trx_perhitungan_penyusutan t1 JOIN ref_daftar_barang a ON 
//             t1.nup = a.nup
//             WHERE 
//             t1.kode_penyusutan IN (
//             SELECT MAX(t2.kode_penyusutan)
//             FROM trx_perhitungan_penyusutan t2
//             WHERE t2.tanggal_penyusutan < :tanggal_akhir
//             GROUP BY nup
//             )
//             ORDER BY t1.tanggal_penyusutan DESC
//             ) aa
//             GROUP BY aa.kode_asset
//         `, {
//             replacements : {
//                 tanggal_akhir : tanggal_akhir
//             },
//             type : QueryTypes.SELECT
//         });

        
//     } catch (error) {
        
//     }
// }

export default {
    LaporanAsset,
    LaporatAssetlvl5,
    LaporanAssetLevel6
}