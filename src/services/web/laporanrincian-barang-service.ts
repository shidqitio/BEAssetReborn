import Trxpersediaanheader from "../../models/trxpersediaanheader-model";
import Trxpersediaandetail from "../../models/trxpersediaandetail2-model";
import RefAsset4 from "../../models/refassetbaru4-model";
import db from "../../config/database";
import { QueryTypes } from "sequelize";
import sequelize from "sequelize";
import TrxBastPersediaan from "../../models/trxbast-model";
import Sequelize from 'sequelize';
const { fn, col, literal } = Sequelize;

const getAll = async () : Promise<[any | null, any | null]> => {
  try {
    
    const laporan_asset_all : Trxpersediaandetail[] = await db.query(`
          SELECT kode_asset_4 AS kode_kelompok_bmut, uraian_kelompok AS nama_kelompok_bmut, SUM(nominal_awal) AS total_nominal_awal 
          ,SUM(nominal_masuk) AS total_nominal_masuk,SUM(nominal_pakai) AS total_nominal_pakai,
          ( (SUM(nominal_awal)+SUM(nominal_masuk))-SUM(nominal_pakai) ) AS nilai_akhir
          from
          (
          (SELECT a.kode_asset_4,a.uraian_kelompok, e.kode_unit,e.harga_satuan,(sum(e.kuantitas)*e.harga_satuan) AS nominal_awal
          ,0 AS nominal_masuk,0 AS nominal_pakai
          FROM ref_asset_baru_4 a 
          left JOIN ref_asset_baru_5 b ON a.kode_asset_4 = b.kode_asset_4
          left JOIN ref_asset_baru_6 c ON b.kode_asset_5 = c.kode_asset_5
          left JOIN ref_asset_persediaan d ON c.kode_asset_6 = d.kode_asset_6
          LEFT JOIN trx_barang_persediaan_detail_2 e ON e.kode_barang_persediaan=d.kode_barang_persediaan
          WHERE e.tahun =2022 AND left(a.kode_asset_4,3)='111'
          GROUP BY a.kode_asset_4,a.uraian_kelompok,e.kode_unit,e.kode_barang, e.kode_barang_persediaan
          ,e.nama_barang,e.harga_satuan)
          UNION ALL 
          (SELECT a.kode_asset_4,a.uraian_kelompok,e.kode_unit,e.harga_satuan
          ,0 AS nominal_awal,(sum(e.kuantitas)*e.harga_satuan)  AS nominal_masuk,0 AS nominal_pakai
          
          FROM ref_asset_baru_4 a 
          left JOIN ref_asset_baru_5 b ON a.kode_asset_4 = b.kode_asset_4
          left JOIN ref_asset_baru_6 c ON b.kode_asset_5 = c.kode_asset_5
          left JOIN ref_asset_persediaan d ON c.kode_asset_6 = d.kode_asset_6
          LEFT JOIN trx_barang_persediaan_detail_2 e ON e.kode_barang_persediaan=d.kode_barang_persediaan
          WHERE e.tahun >=2023 AND left(a.kode_asset_4,3)='111'
          GROUP BY a.kode_asset_4,a.uraian_kelompok,e.kode_unit,e.kode_barang, e.kode_barang_persediaan,e.nama_barang
          ,e.harga_satuan)
          UNION ALL
          (SELECT a.kode_asset_4,a.uraian_kelompok,p.kode_unit,0 AS satuan,0 AS nominal_awal
          ,0 AS nominal_masuk,SUM(p.harga_didapat) AS nominal_pakai
          FROM ref_asset_baru_4 a 
          left JOIN ref_asset_baru_5 b ON a.kode_asset_4 = b.kode_asset_4
          left JOIN ref_asset_baru_6 c ON b.kode_asset_5 = c.kode_asset_5
          left JOIN ref_asset_persediaan d ON c.kode_asset_6 = d.kode_asset_6
          LEFT JOIN trx_request_pemakaian_2 p ON p.kode_barang_persediaan=d.kode_barang_persediaan
          WHERE left(a.kode_asset_4,3)='111'
          GROUP BY a.kode_asset_4,a.uraian_kelompok,p.kode_unit)
          ) AS QUERY
          GROUP BY 
          kode_asset_4, 
          uraian_kelompok`,
            {
                type : QueryTypes.SELECT,
            }
        )

    return [ laporan_asset_all, null ]


  } catch (error : any) {
      return [null, {code : 500, message : error.message}]
  }
}

const getByTahun = async (tahun: string) : Promise<[any | null, any | null]> => {
  try {
    
    const laporan_asset_detail : Trxpersediaandetail[] = await db.query(`
        SELECT 
        kode_kelompok_bmut,
        nama_kelompok_bmut, 
        SUM(nilai_akhir) AS nilai_akhir 
        FROM 
        v_laporan_rincian_barang
        WHERE tahun<=:tahun
        GROUP BY kode_kelompok_bmut;`,
            {
                replacements : {tahun},
                type : QueryTypes.SELECT,
            }
        )

    return [ laporan_asset_detail, null ]


  } catch (error : any) {
      return [null, {code : 500, message : error.message}]
  }
}

const getByUnit = async (kode_unit: string) : Promise<[any | null, any | null]> => {
  try {
    
    const laporan_persediaan : Trxpersediaandetail[] = await db.query(`
        SELECT 
        a.tanggal_pembukuan as tanggal,
        a.kode_unit,
        a.nomor_dokumen,
        a.kode_barang,
        a.nama_barang,
        b.nama_persediaan AS nama_barang,
        a.kode_barang_persediaan,
        a.tahun,
        SUM(a.harga_satuan_awal) AS harga_satuan_awal,
        SUM(a.jumlahSaldoAwal) AS jumlah_saldo_awal,
        SUM(a.nominal_saldo_awal) AS nominal_saldo_awal,
        SUM(a.jumlah_masuk) AS jumlah_masuk,
        SUM(a.nominal_masuk) AS nominal_masuk,
        SUM(a.jumlah_keluar) AS jumlah_keluar,
        SUM(a.nominal_keluar) AS nominal_keluar
        from v_transaksi_bast a
        INNER JOIN ref_asset_persediaan b
        ON a.kode_barang_persediaan=b.kode_barang_persediaan
        WHERE a.kode_unit = :kode_unit
        GROUP BY a.kode_unit, a.nama_barang, a.kode_barang_persediaan;`,
            {
                replacements : {kode_unit},
                type : QueryTypes.SELECT,
            }
        )

    return [ laporan_persediaan, null ]


  } catch (error : any) {
      return [null, {code : 500, message : error.message}]
  }
}

const getAllSaldoAwal = async () : Promise<[any | null, any | null]> => {
  try {
    
    const laporan_saldo_awal : Trxpersediaandetail[] = await db.query(`
            SELECT * FROM v_report_saldo_awal;`,
            {
                type : QueryTypes.SELECT,
            }
        )

    return [ laporan_saldo_awal, null ]


  } catch (error : any) {
      return [null, {code : 500, message : error.message}]
  }
}

export default {
    getAll,
    getByTahun,
    getByUnit,
    getAllSaldoAwal
}