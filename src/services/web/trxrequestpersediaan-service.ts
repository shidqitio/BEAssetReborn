import sequelize from "sequelize";
import { TrxRequestPemakaianRequest, RequestPemakaianExcel } from "../../controllers/web/trxrequestpemakaian-controller";
import { status_pemakaian, pakai_unit } from "../../models/trxpersediaandetail-model";
import { usulan } from "../../models/trxrequestpemakaian-model";
import TrxBarangPersediaanDetail from "../../models/trxpersediaandetail-model";
import TrxBarangPersediaanHeader from "../../models/trxpersediaanheader-model";
import TrxRequestPemakaian from "../../models/trxrequestpemakaian-model";
import { Op, QueryTypes } from "sequelize";
import db from "../../config/database";
import generateNumber from '../../utils/generatenumber'
import CustomError from "../../middlewares/error-handler";


const excelPemakaian =async (
    request:RequestPemakaianExcel) : Promise<[any | null, any | null]> => {
    const t = await db.transaction()
    try {
        let array_awal : any = request.request_pemakaian
        for(let x : number = 0 ; x < array_awal.length ; x++) {
            let max_request_pemakaian : number = await TrxRequestPemakaian.max("kode_pemakaian", {
                transaction : t
            })
            let hasil
            if(max_request_pemakaian === null) {
                hasil = 1
            }
            else{
                hasil = generateNumber.generateNumber(max_request_pemakaian)
            }
            console.log(hasil)
            let create_trxRequestPemakaian : TrxRequestPemakaianRequest = await TrxRequestPemakaian.create({
                kode_pemakaian : hasil,
                tanggal_pemakaian : array_awal[x].tanggal_pemakaian,
                nip : array_awal[x].nip,
                kode_unit : array_awal[x].kode_unit,
                nama_pengusul : array_awal[x].nama_pengusul,
                kode_barang_persediaan : array_awal[x].kode_barang_persediaan,
                usulan : usulan.option1,
                jumlah : array_awal[x].jumlah,
                jumlah_disetujui : array_awal[x].jumlah,
                keterangan : array_awal[x].keterangan,
                alasan : array_awal[x].alasan,
                status : 4,
                ucr : array_awal[x].ucr
            }, {transaction : t})

            if(!create_trxRequestPemakaian){
                await t.rollback()
                return [null, {code : 499, message : "Data Tidak Ada"}]
            }


            let dataBarang : TrxBarangPersediaanDetail[] = await TrxBarangPersediaanDetail.findAll({
                where : {
                    kode_barang_persediaan : array_awal[x].kode_barang_persediaan,
                    kode_unit : array_awal[x].kode_unit,
                    status_pemakaian : status_pemakaian.option1,
                    pakai_unit : pakai_unit.option2
                },
                limit : array_awal[x].jumlah,
                transaction : t
            })

            if(dataBarang.length === 0) {
                await t.rollback()
                return [null, {code : 499, message : "Data Tidak ada / Sudah habis terpakai"}]
            }

            let updateBarang : any = await db.query(`
                UPDATE trx_barang_persediaan_detail a 
                SET a.status_pemakaian = :status_pemakaian, a.kode_pemakaian = :kode_pemakaian, a.uch = :uch
                WHERE a.kode_urut IN (
                SELECT aa.kode_urut FROM trx_barang_persediaan_detail aa
                WHERE aa.kode_barang_persediaan = :kode_barang_persediaan AND aa.status_pemakaian = 'Penyimpanan'
                ORDER BY aa.kode_urut ASC
                )
                AND a.kode_barang_persediaan = :kode_barang_persediaan AND a.kode_unit = :kode_unit
                LIMIT :jumlah
                `, {
                    type : QueryTypes.UPDATE,
                    replacements : {
                        status_pemakaian : status_pemakaian.option3,
                        kode_pemakaian : hasil,
                        kode_unit : array_awal[x].kode_unit,
                        kode_barang_persediaan : array_awal[x].kode_barang_persediaan,
                        jumlah : array_awal[x].jumlah,
                        uch : array_awal[x].ucr
                    }, 
                    transaction : t
                })

            if(updateBarang[1] === 0) {
                await t.rollback()
                return [null, {code : 499, message : "Data Update Gagal"}]
            }

        }

        await t.commit()

        return [array_awal, null]

    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

const getRequestPemakaian =async (
    kode:string)  : Promise<[any | null, any | null]> => {
    try {
        const pemakaian : TrxRequestPemakaian[] = await TrxRequestPemakaian.findAll({
            where : {
                kode_unit : kode
            },
        }) 

        if(pemakaian.length === 0){
            throw new CustomError(499, "Data Tidak Ada")
        }

        return [pemakaian, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const hapusPemakaian =async (
    kode:string) : Promise<[any | null, any | null]> => {
        const t = await db.transaction()
    try {
        const exRequest : TrxRequestPemakaian[] = await TrxRequestPemakaian.findAll({
            where : {
                kode_unit : kode
            }, 
            transaction : t
        })

        if(exRequest.length === 0 ) {
            return [null, {code : 499, message : "Data Tidak ada"}]
        }

        const deleteRequest = await TrxRequestPemakaian.destroy({
            where : {
                kode_unit : kode
            },
            transaction : t
        })

        if(!deleteRequest) {
            return [null, {code : 499, message : "Data Gagal Hapus"}]
        }

        const cekStok = await TrxBarangPersediaanDetail.findAll({
            where : {
                kode_unit : kode
            },
            transaction : t
        })

        if(cekStok.length === 0){
            return [null, {code : 499, message : "Data Stok Tidak Ada"}]
        }

        const updateStok = await TrxBarangPersediaanDetail.update({
            status_pemakaian : status_pemakaian.option1,
            kode_pemakaian : null
        }, 
        {
            where : {
                kode_unit : kode
            },
            transaction : t
        })


        if(updateStok[0] === 0) {
            return [null, {code : 499, message : "Ubah Stok Gagal"}]
        }

        await t.commit()

        return [exRequest, null]
    } catch (error: any) {
        t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

export default {
    excelPemakaian,
    getRequestPemakaian,
    hapusPemakaian
}