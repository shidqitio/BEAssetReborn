
import { TrxRequestPemakaianRequest, RequestPemakaianExcel } from "../../controllers/web/trxrequestpemakaian-controller";
import { status_pemakaian, pakai_unit } from "../../models/trxpersediaandetail-model";
import { usulan } from "../../models/trxrequestpemakaian-model";
import TrxBarangPersediaanDetail from "../../models/trxpersediaandetail-model";
import TrxBarangPersediaanHeader from "../../models/trxpersediaanheader-model";
import TrxBarangPersediaanDetail2 from "../../models/trxpersediaandetail2-model";
import TrxRequestPemakaian from "../../models/trxrequestpemakaian-model";
import TrxRequestPemakaian2 from "../../models/trxrequestpemakaian2-model";
import { Op, QueryTypes} from "sequelize";
import db from "../../config/database";
import generateNumber from '../../utils/generatenumber'
import CustomError from "../../middlewares/error-handler";
import sequelize from "sequelize";

export interface barang_gagal {
                alasan : string,
                kode_barang_persediaan: string,
                nama_barang_persediaan : string,
                jumlah : number,
}

const excelPemakaian =async (
    request:RequestPemakaianExcel) : Promise<[any | null, any | null]> => {
    const t = await db.transaction()
    try {
        let array_awal : any = request.request_pemakaian
        let datagagal  = []
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

            let countDataBarang = await TrxBarangPersediaanDetail.count({
                where : {
                    kode_barang_persediaan : array_awal[x].kode_barang_persediaan,
                    kode_unit : array_awal[x].kode_unit,
                    status_pemakaian : status_pemakaian.option1,
                    pakai_unit : pakai_unit.option2
                },
                transaction : t
            })

            if(countDataBarang >= array_awal[x].jumlah){
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
            else {
            //Jika data salah 
            let gagal = {} as barang_gagal  
            gagal.alasan = "Data Kurang / Tidak Ada"
            gagal.kode_barang_persediaan = array_awal[x].kode_barang_persediaan
            gagal.nama_barang_persediaan = array_awal[x].nama_barang_persediaan
            gagal.jumlah = array_awal[x].jumlah
            // let barang_gagal = {
            //     alasan : "Data Kurang / Tidak Ada",
            //     kode_barang_persediaan: 
            //     nama_barang_persediaan : array_awal[x].nama_barang_persediaan,
            //     jumlah : array_awal[x].jumlah,
            // }
            datagagal.push(gagal)
            }
        }

        if(datagagal.length > 0) {
            await t.rollback()      
            return [null, {code : 499, message : datagagal}]
        }
        else {
            await t.commit()

            return [array_awal, null]
        }
    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}


const excelPemakaian2 =async (
    request:RequestPemakaianExcel) : Promise<[any | null, any | null]> => {
    const t = await db.transaction()
    try {
        let array_awal : any = request.request_pemakaian
        let datagagal  = []
        for(const data of array_awal) {
            const detailBarang  = await TrxBarangPersediaanDetail2.findAll({
                where : {
                    kode_barang_persediaan : data.kode_barang_persediaan, 
                    kode_unit : data.kode_unit
                }, 
                order : [["kode_urut", "ASC"]],
                transaction : t
            }) 

            let max_request_pemakaian : number = await TrxRequestPemakaian2.max("kode_pemakaian", {
                transaction : t
            })
            let hasil
            if(max_request_pemakaian === null) {
                hasil = 1
            }
            else{
                hasil = generateNumber.generateNumber(max_request_pemakaian)
            }

            const createPemakaian = await TrxRequestPemakaian2.create({
                kode_pemakaian : hasil, 
                kode_barang_persediaan : data.kode_barang_persediaan,
                tanggal_pemakaian : data.tanggal_pemakaian,
                kode_unit : data.kode_unit,
                jumlah : data.jumlah,
                nip : data.nip,
                nama_pengusul : data.nama_pengusul,
                ucr : data.ucr,
            }, {transaction : t})
               
            if(!createPemakaian) {
                await t.rollback()
                return [null, {code : 499, message : `Data Create Gagal`}]
            }

            let jumlah : number = data.jumlah

            const sumBarang : number = await TrxBarangPersediaanDetail2.sum("kuantitas_gerak", {
                    where : {
                        kode_barang_persediaan : data.kode_barang_persediaan,
                        kode_unit : data.kode_unit
                    },
                    transaction : t
                })
  

            if(sumBarang < jumlah) {
                await t.rollback()
                return [null, {code : 499, message : [
                    {
                        alasan : "Data Tidak Ada atau Kurang",
                        kode_barang_persediaan : data.kode_barang_persediaan,
                        nama_barang_persediaan : data.nama_barang_persediaan,
                        jumlah : data.jumlah
                    }
                ]}] 
            }


            let uang : number = 0
            for(const detail of detailBarang) {
             
                const totalSatuanBarang : any = detail.kuantitas_gerak
                const kode_urut : any = detail.kode_urut

                if(totalSatuanBarang >= jumlah) {

                    const hasil = totalSatuanBarang - jumlah
                    await TrxBarangPersediaanDetail2.update({
                        kuantitas_gerak : hasil
                    }, {
                        where : {
                            kode_barang_persediaan : data.kode_barang_persediaan,
                            kode_unit : data.kode_unit,
                            kode_urut : kode_urut
                        },
                        transaction : t
                    })

                    const harga = await TrxBarangPersediaanDetail2.findOne({
                        attributes : [
                            "harga_satuan"
                        ],
                        where : {
                            kode_barang_persediaan : data.kode_barang_persediaan,
                            kode_unit : data.kode_unit,
                            kode_urut : kode_urut
                        }, 
                    })
                
                    let harga_satuan = harga?.harga_satuan || 0
                    uang = harga_satuan * jumlah + uang
                    
                    break ;
                }
                else {
                    
                    
                    let hargaGerak = await TrxBarangPersediaanDetail2.findOne({
                        attributes : [
                            "kuantitas_gerak", "harga_satuan"
                        ],
                        where : {
                            kode_barang_persediaan : data.kode_barang_persediaan,
                            kode_unit : data.kode_unit,
                            kode_urut : kode_urut
                        }, 
                        transaction : t
                    })
                    let kuantitas : number = hargaGerak?.kuantitas_gerak || 0
                    let harga_satuan : number = hargaGerak?.harga_satuan || 0
                    uang = kuantitas * harga_satuan + uang
                    
                    await TrxBarangPersediaanDetail2.update({
                        kuantitas_gerak : 0
                    }, {
                        where : {
                            kode_barang_persediaan : data.kode_barang_persediaan,
                            kode_unit : data.kode_unit,
                            kode_urut : kode_urut
                        },
                        transaction : t
                    })
                    jumlah -= totalSatuanBarang
                }
            }

            const updateHitung = await TrxRequestPemakaian2.update({
                harga_didapat : uang
            }, {
                where : {
                    kode_pemakaian : hasil,
                    kode_barang_persediaan : data.kode_barang_persediaan, 
                    kode_unit : data.kode_unit
                },
                transaction : t
            })

            if(updateHitung[0] === 0) {
                await t.rollback()
                return [null, {code : 499, message : `Data  Update Gagal`}]
            }
            
        }
        await t.commit()
        return[array_awal, null]

        // if(datagagal.length > 0) {
        //     await t.rollback()      
        //     return [null, {code : 499, message : datagagal}]
        // }
        // else {
        //     await t.commit()

        //     return [array_awal, null]
        // }
    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}


const excelPemakaian3 =async (
    request:RequestPemakaianExcel) : Promise<[any | null, any | null]> => {
    const t = await db.transaction()
    try {
        let array_awal : any = request.request_pemakaian
        let datagagal  = []
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

            let countDataBarang = await TrxBarangPersediaanDetail.count({
                where : {
                    kode_barang_persediaan : array_awal[x].kode_barang_persediaan,
                    kode_unit : array_awal[x].kode_unit,
                    status_pemakaian : status_pemakaian.option1,
                    pakai_unit : pakai_unit.option2
                },
                transaction : t
            })

            if(countDataBarang < array_awal[x].jumlah){
                    //Jika data salah 
            // let gagal = {} as barang_gagal  
            // gagal.alasan = "Data Kurang / Tidak Ada"
            // gagal.kode_barang_persediaan = array_awal[x].kode_barang_persediaan
            // gagal.nama_barang_persediaan = array_awal[x].nama_barang_persediaan
            // gagal.jumlah = array_awal[x].jumlah
            // // let barang_gagal = {
            // //     alasan : "Data Kurang / Tidak Ada",
            // //     kode_barang_persediaan: 
            // //     nama_barang_persediaan : array_awal[x].nama_barang_persediaan,
            // //     jumlah : array_awal[x].jumlah,
            // // }
            // datagagal.push(gagal)

            await t.rollback()
            return [null, {code : 499, message : [
                {
                    alasan : "Data Kurang / Tidak Ada",
                    nama_barang_persediaan : array_awal[x].nama_barang_persediaan,
                    jumlah : array_awal[x].jumlah,
                }
            ]}]
            }
        }
       

        // if(datagagal.length > 0) {
        //     await t.rollback()      
        //     return [null, {code : 499, message : datagagal}]
        // }
        // else {
        //     await t.commit()

        //     return [array_awal, null]
        // }
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

const getRequestPemakaian2 =async (
    kode:string)  : Promise<[any | null, any | null]> => {
    try {
        const pemakaian : TrxRequestPemakaian2[] = await TrxRequestPemakaian2.findAll({
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

const hapusPemakaian2 =async (
    kode:string) : Promise<[any | null, any | null]> => {
        const t = await db.transaction()
    try {
        const exRequest : TrxRequestPemakaian[] = await TrxRequestPemakaian2.findAll({
            where : {
                kode_unit : kode
            }, 
            transaction : t
        })

        if(exRequest.length === 0 ) {
            return [null, {code : 499, message : "Data Tidak ada"}]
        }

        const deleteRequest = await TrxRequestPemakaian2.destroy({
            where : {
                kode_unit : kode
            },
            transaction : t
        })

        if(deleteRequest === 0) {
            return [null, {code : 499, message : "Data Gagal Hapus"}]
        }

        
        const cekStok = await TrxBarangPersediaanDetail2.findAll({
            where : {
                kode_unit : kode
            },
            transaction : t
        })

        if(cekStok.length === 0){
            return [null, {code : 499, message : "Data Stok Tidak Ada"}]
        }


        const affectedRows = await TrxBarangPersediaanDetail2.update({
            kuantitas_gerak : sequelize.col('kuantitas')
        }, 
        {
            where : {
                kode_unit : kode
            },
            returning : true,
            transaction : t,
            
        })


        if(affectedRows[0] === 0) {
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
    hapusPemakaian,
    excelPemakaian2,
    excelPemakaian3,
    getRequestPemakaian2,
    hapusPemakaian2
}
