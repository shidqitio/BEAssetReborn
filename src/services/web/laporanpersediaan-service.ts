import Trxpersediaanheader from "../../models/trxpersediaanheader-model";
import Trxpersediaandetail from "../../models/trxpersediaandetail-model";
import db from "../../config/database";
import { QueryTypes } from "sequelize";
import sequelize from "sequelize";
import TrxBastPersediaan from "../../models/trxbast-model";
import Sequelize from 'sequelize';
import moment from 'moment';
const { fn, col, literal } = Sequelize;

const getAll =async () : Promise<[any | null, any | null]> => {
    try {
        const laporan_asset_baru : Trxpersediaandetail[] = await Trxpersediaandetail.findAll({
            attributes : {exclude : ['udcr', 'udch']}
        })

        return [laporan_asset_baru, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const getById = async (kode_unit: string) : Promise<[any | null, any | null]> => {
  try {
    
    const laporan_asset_detail : Trxpersediaandetail[] = await db.query(`SELECT 
        tanggal,
        kode_unit,
        nomor_dokumen,
        kode_barang,
        nama_barang,
        kode_barang_persediaan,
        tahun,
        SUM(harga_satuan_awal) AS harga_satuan_awal,
        SUM(jumlah_saldo_awal) AS jumlah_saldo_awal,
        SUM(nominal_saldo_awal) AS nominal_saldo_awal,
        SUM(jumlah_masuk) AS jumlah_masuk,
        SUM(nominal_masuk) AS nominal_masuk,
        SUM(jumlah_keluar) AS jumlah_keluar,
        SUM(nominal_keluar) AS nominal_keluar
        from laporan_barang
        WHERE kode_unit = :kode_unit
        GROUP BY kode_unit, nama_barang, kode_barang_persediaan;`,
            {
                replacements : {kode_unit},
                type : QueryTypes.SELECT,
            }
        )

    const rawData = JSON.parse(JSON.stringify(laporan_asset_detail))

    const laporan_asset_header : Trxpersediaanheader[] = await Trxpersediaanheader.findAll({
    attributes: [
            'kode_barang',
            'nama_barang',
            [fn('SUM', col('total')), 'SaldoAwal'],
            [fn('SUM', col('total')), 'SaldoAkhir'],
        ],
        group: ['kode_barang']
    })

    let returnLaporan = rawData.map((raw : any) => {
        const barang_header = laporan_asset_header.filter((item: any) => item.kode_barang === raw.kode_barang)
        // jumlah akhir
        const jumlah_saldo_akhir = parseInt(raw.jumlah_saldo_awal) + parseInt(raw.jumlah_masuk) - parseInt(raw.jumlah_keluar);

        // saldo akhir
        const nominal_saldo_akhir = parseInt(raw.nominal_saldo_awal) + parseInt(raw.nominal_masuk) - parseInt(raw.nominal_keluar);
        return {
            ...raw,
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