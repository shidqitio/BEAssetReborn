import Trxpersediaanheader from "../../models/trxpersediaanheader-model";
import Trxpersediaandetail from "../../models/trxpersediaandetail2-model";
import RequestPemakaian from "../../models/trxrequestpemakaian2-model";
import db from "../../config/database";
import { QueryTypes } from "sequelize";
import sequelize from "sequelize";
import TrxBastPersediaan from "../../models/trxbast-model";
import Sequelize from 'sequelize';
import moment from 'moment';
const { fn, col, literal } = Sequelize;

const getAll = async () : Promise<[any | null, any | null]> => {
    try {
      
      const laporan_asset_all_level_4 : Trxpersediaandetail[] = await db.query(`
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
  
      return [ laporan_asset_all_level_4, null ]
  
  
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
  }

  const getById = async (kode_unit: string) : Promise<[any | null, any | null]> => {
    try {
      
      const laporan_saldo_awal : Trxpersediaandetail[] = await db.query(`SELECT
              aa.tahun,
              aa.kode_unit,
              aa.kode_barang,
              aa.nama_barang, 
              aa.kode_barang_persediaan,
              SUM(aa.jumlah_saldo_awal) AS jumlah_saldo_awal, 
              SUM(aa.nominal_saldo_awal) AS nominal_saldo_awal
              FROM (
              SELECT 
              a.tahun,
              a.kode_unit,
              a.kode_barang,
              a.nama_barang, 
              a.kode_barang_persediaan,
              SUM(a.kuantitas) AS jumlah_saldo_awal,
              (SUM(a.kuantitas)*a.harga_satuan) AS nominal_saldo_awal
              FROM trx_barang_persediaan_detail_2 a
              WHERE 
              a.tahun = 2022 AND kode_unit = :kode_unit
              GROUP BY 
              a.kode_unit,
              a.kode_barang,
              a.nama_barang, 
              a.kode_barang_persediaan,
              a.harga_satuan) AS aa
              GROUP BY 
              aa.kode_unit,
              aa.kode_barang_persediaan`,
              {
                  replacements : {kode_unit},
                  type : QueryTypes.SELECT,
              }
          )
          
          const persediaan : Trxpersediaandetail[] = await Trxpersediaandetail.findAll({
            attributes: [
                'kode_unit',
                'kode_barang',
                'kode_barang_persediaan',
                'nama_barang',
            ],
            where: {
                kode_unit
            },
            group: [
                'kode_unit',
                'kode_barang',
                'kode_barang_persediaan',
                'nama_barang',
            ],
            raw: true
          })
          
          const pemakaian : RequestPemakaian[] = await RequestPemakaian.findAll({
            attributes: [
                'kode_barang_persediaan',
                [sequelize.fn('SUM', sequelize.col('jumlah')), 'hitung'],
                [sequelize.fn('SUM', sequelize.col('harga_didapat')), 'harga_didapat'],
                [sequelize.literal('(SUM(jumlah) * SUM(harga_didapat))'), 'hasil'],
              ],
              where: {
                kode_unit
              },
              group: ['kode_barang_persediaan'],
          })
          
          const pembelian : Trxpersediaandetail[] = await db.query(`SELECT
                  aa.tahun,
                  aa.kode_unit,
                  aa.kode_barang,
                  aa.nama_barang, 
                  aa.kode_barang_persediaan,
                  SUM(aa.jumlah_saldo_awal) AS jumlah_saldo_awal, 
                  SUM(aa.nominal_saldo_awal) AS nominal_saldo_awal
                  FROM (
                  SELECT 
                  a.tahun,
                  a.kode_unit,
                  a.kode_barang,
                  a.nama_barang, 
                  a.kode_barang_persediaan,
                  SUM(a.kuantitas) AS jumlah_saldo_awal,
                  (SUM(a.kuantitas)*a.harga_satuan) AS nominal_saldo_awal
                  FROM trx_barang_persediaan_detail_2 a
                  WHERE 
                  a.tahun = 2023 AND kode_unit = :kode_unit
                  GROUP BY 
                  a.kode_unit,
                  a.kode_barang,
                  a.nama_barang, 
                  a.kode_barang_persediaan,
                  a.harga_satuan) AS aa
                  GROUP BY aa.kode_barang_persediaan;`,
              {
                  replacements : {kode_unit},
                  type : QueryTypes.SELECT,
              }
          )
          
        //   const pembelian2 : TrxBarangPersediaanDetailNew[] = await TrxBarangPersediaanDetailNew.findAll({
        //     attributes: [
        //         'tahun',
        //         'kode_unit',
        //         'kode_barang',
        //         'nama_barang',
        //         'kode_barang_persediaan',
        //         [fn('SUM', col('kuantitas')), 'jumlah_saldo_awal'],
        //     ]
        //   })
  
      const rawData = JSON.parse(JSON.stringify(persediaan))
      const rawData2 = JSON.parse(JSON.stringify(laporan_saldo_awal))
      const rawData3 = JSON.parse(JSON.stringify(pembelian))
      const rawData4 = JSON.parse(JSON.stringify(pemakaian))
  
      const laporan_asset_header : Trxpersediaanheader[] = await Trxpersediaanheader.findAll({
      attributes: [
              'kode_barang',
              'nama_barang',
          ],
          group: ['kode_barang']
      })
  
      let returnLaporan = rawData.map((raw : any) => {
          const saldoAwalRaw = rawData2.filter((item: any) => item.kode_barang_persediaan === raw.kode_barang_persediaan)
  
          const pembelianRaw = rawData3.filter((item: any) => item.kode_barang_persediaan === raw.kode_barang_persediaan)
  
          const pemakaianRaw = rawData4.filter((item: any) => item.kode_barang_persediaan === raw.kode_barang_persediaan)
  
          const barang_header = laporan_asset_header.filter((item: any) => item.kode_barang === raw.kode_barang)
  
          // jumlah akhir
          const jumlah_saldo_akhir = parseInt(saldoAwalRaw[0]?.jumlah_saldo_awal ?? 0) + parseInt(pembelianRaw[0]?.jumlah_saldo_awal ?? 0) - parseInt(pemakaianRaw[0]?.hitung ?? 0);
  
          // saldo akhir
          const nominal_saldo_akhir = parseInt(saldoAwalRaw[0]?.nominal_saldo_awal ?? 0) + parseInt(pembelianRaw[0]?.nominal_saldo_awal ?? 0) - parseInt(pemakaianRaw[0]?.harga_didapat ?? 0);
  
          return {
              kode_unit: raw.kode_unit,
              kode_barang: raw.kode_barang,
              nama_barang: raw.nama_barang,
              kode_barang_persediaan: raw.kode_barang_persediaan,
              tahun: raw.tahun,
              jumlah_saldo_awal: saldoAwalRaw[0]?.jumlah_saldo_awal ?? 0,
              nominal_saldo_awal: saldoAwalRaw[0]?.nominal_saldo_awal ?? 0,
              jumlah_masuk: pembelianRaw[0]?.jumlah_saldo_awal ?? 0,
              nominal_masuk: pembelianRaw[0]?.nominal_saldo_awal ?? 0,
              jumlah_keluar: pemakaianRaw[0]?.hitung ?? 0,
              nominal_keluar: pemakaianRaw[0]?.harga_didapat ?? 0,
              jumlah_saldo_akhir,
              nominal_saldo_akhir,
              barang_header: barang_header[0],
          }
      })
  
      return [ returnLaporan, null ]
  
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
  }

export default {
    getAll,
    getById,
}