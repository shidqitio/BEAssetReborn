import TrxBarangPersediaanHeader from "../../models/trxpersediaanheader-model";
import TrxBarangPersediaanDetail from "../../models/trxpersediaandetail-model";
import TrxBarangPersediaanDetail2  from "../../models/trxpersediaandetail2-model";
import TrxBarangPersediaanDetail3 from "../../models/trxpersediaandetail3-model";
import TrxBarangPenampung from "../../models/trxbarangpenampung-model";
import JenisPersediaan from "../../models/jenispersediaan-model";
import TrxBastPersediaan from "../../models/trxbast-model";
import { BarangPromiseRequest, BarangDetailRequest, BarangPromise, BarangExcelRequest, StoreBarangPromiseNew, BarangPromiseNew,
    RequestBarangPromise
} from "../../controllers/web/trxbarangpersediaan-controller";
import { Op } from "sequelize";
import Sequelize from "sequelize";
import sequelize from "sequelize";
import db from "../../config/database";
import generatenumber from "../../utils/generatenumber";
import { status_pemakaian, pakai_unit } from "../../models/trxpersediaandetail-model";
import CustomError from "../../middlewares/error-handler";
import dotenv from "dotenv"
import { removeFile, removeFileName } from "../../utils/remove-file";
dotenv.config()
import fs from "fs/promises";
import path from "path"
import axios from "axios";





const getBarangPromise =async (kode : string) : Promise<[any | null, any | null]> => {
    try {
        const BarangPromise : TrxBastPersediaan[] = await TrxBastPersediaan.findAll({
            where : {
                kode_unit : kode
            }, 
            attributes : {exclude : ["ucr", "uch", "udcr", "udch"]},
            include : [
                {
                    model : TrxBarangPersediaanHeader, 
                    as : 'TrxBarangPersediaanHeader',
                    attributes : {exclude : ["ucr", "uch", "udcr", "udch"]}
                }
            ]
        })

        if(BarangPromise.length === 0) {
            return [null, {code : 409, message : "Data BAST Unit Tidak Ada"}]
        }

        return [BarangPromise,null]

    } catch (error:any) {
        return [null, {code : 500, message : error.code}]
    }
}

const getBarangPromiseProses =async (
    kode:string) : Promise<[any | null, any | null]> => {
    try {
        const Bast : TrxBastPersediaan[] = await TrxBastPersediaan.findAll({
            where : {
                kode_unit : kode
            },
            attributes : {exclude : ['ucr', 'udcr', 'udch', 'uch']},
            include : [
                    {
                        model : TrxBarangPersediaanHeader,
                        as : "TrxBarangPersediaanHeader",
                    },
                    {
                        model : TrxBarangPersediaanDetail, 
                        as : "trxpersediaandetail",
                        attributes : [
                            'nomor_dokumen',
                            'kode_barang',
                            [sequelize.fn('sum', sequelize.col('TrxBarangPersediaan.harga_satuan')),'harga_persediaan']
                        ],
                    }
                ],
            group : ['TrxBarangPersediaan.kode_barang', 'TrxBarangPersediaanHeader.kode_barang', 'nomor_dokumen'],
        })

        if(Bast.length === 0 ) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        const rawData = JSON.parse(JSON.stringify(Bast))


        let hasil1 = rawData.map((raw : any) => {
            const a = raw.TrxBarangPersediaanHeader;
            const b = raw.TrxBarangPersediaan;
            let data1 = a.map((header : any) => {
                const data = b.filter((item : any) => item.kode_barang === header.kode_barang && item.nomor_dokumen === header.nomor_dokumen)
                return {
                    ...header,
                    harga_persediaan : data.length > 0 ? data[0].harga_persediaan : null
                }
            })
            return  {
                kode_persediaan : raw.kode_persediaan, 
                nomor_dokumen : raw.nomor_dokumen, 
                nama_penyedia : raw.nama_penyedia, 
                tanggal_dokumen : raw.tanggal_dokumen, 
                tanggal_pembukuan : raw.tanggal_pembukuan, 
                nilai_total : raw.nilai_total, 
                kode_unit : raw.kode_unit, 
                status : raw.status,
                alasan : raw.alasan,
                TrxBarangPersediaanHeader : data1
            }
        })

        return [hasil1, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const getForm =async (request : BarangDetailRequest)  : Promise<[any | null, any | null]>   => {
    try {
        let harga_persediaan


        const Bast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
            where : {
                nomor_dokumen : request.nomor_dokumen
            },
            include : [
                {
                    model : TrxBarangPersediaanHeader, 
                    as : "TrxBarangPersediaanHeader", 
                    where : {
                        nomor_dokumen : request.nomor_dokumen,
                        kode_barang : request.kode_barang
                    },
                }, 
                {
                    model : TrxBarangPersediaanDetail, 
                    as : 'trxpersediaandetail',
                    where : {
                        nomor_dokumen :request.nomor_dokumen,
                        kode_barang :request.kode_barang
                    },
                    attributes : [
                        'nomor_dokumen',
                        'kode_barang_persediaan',
                        'nama_barang',
                        [sequelize.fn('count', sequelize.col('kode_barang_persediaan')),'jumlah'],
                        'satuan',
                        'harga_satuan',
                        [sequelize.fn('sum', sequelize.col('TrxBarangPersediaanHeader.harga_satuan')), 'harga_total'],
                        'keterangan'
                    ],
                  
                    required : false
                }
            ],
            group : ['trxpersediaandetail.kode_barang_persediaan'],
        })

        if(!Bast) {
            return [null, {code : 409, message : "Data BAST Tidak Ada"}]
        }

        const total_harga : TrxBarangPersediaanHeader | null = await TrxBarangPersediaanHeader.findOne({
            attributes : ["total"],
            where : {
                nomor_dokumen : request.nomor_dokumen,
                kode_barang : request.kode_barang
            }
        });

        if(!total_harga) {
            return [null, {code : 409, message : "Data BAST Tidak Ada"}]
        }

        const DataHarga : any = await TrxBarangPersediaanDetail.findAll({
            where : {
                nomor_dokumen : request.nomor_dokumen,
                kode_barang : request.kode_barang,
            },
            attributes : [
                [sequelize.fn('sum', sequelize.col('harga_satuan')),'harga_persediaan']
            ],
            group : ['kode_barang']
        })

        if(DataHarga.length === 0) {
            harga_persediaan = 0
        }
        else {
            harga_persediaan = DataHarga[0].getDataValue("harga_persediaan")
        }

        let stringifydata = JSON.parse(JSON.stringify(Bast))

        let data_tampil = {
            ...stringifydata,
            total_harga,
            harga_persediaan
        }

        return [data_tampil, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const storeDataPromise =async (
    request:BarangPromiseRequest) : Promise<[any | null, any | null]> => {
        const t = await db.transaction()
    try {
        const exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
            where : {
                nomor_dokumen : request.nomor_dokumen
            }
        });

        if(exBast) {
            return [null, {code : 409, message  : "Data BAST Sudah Ada"}]
        }

        const newBast : TrxBastPersediaan = await TrxBastPersediaan.create({
            nomor_dokumen : request.nomor_dokumen,
            tanggal_dokumen : request.tanggal_dokumen,
            kode_unit : request.kode_unit,
            status : -1,
            tanggal_pembukuan : request.tanggal_pembukuan,
            ucr : request.ucr,
        }, {
            transaction : t
        })

        if(!newBast) {
            return [null, {code : 409, message : "Data Insert Gagal"}]
        }

        const newBarang : any[] = request.BarangPromise.map((item : BarangPromise) => {
            return {
                kode_barang : item.kode_barang,
                nomor_dokumen : request.nomor_dokumen,
                nama_barang : item.nama_barang,
                jumlah : item.jumlah,
                harga_satuan : item.harga_satuan,
                total : item.total,
                ucr : request.ucr
            }
        })

        const newBarangBulk : TrxBarangPersediaanHeader[] = await TrxBarangPersediaanHeader.bulkCreate(newBarang,{
            transaction : t
        })

        if(!newBarangBulk) {
            return [null, {code : 409, message : "Data Bulk Create Gagal Dibuat"}]
        }

        await t.commit()

        return [newBast, null]

    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

const detailBarang =async (
    request:BarangDetailRequest)  : Promise<[any | null, any | null]> => {
    const t = await db.transaction()
        try {
        const BarangHeader : TrxBarangPersediaanHeader | null = await TrxBarangPersediaanHeader.findOne({
            where : {
                nomor_dokumen : request.nomor_dokumen,
                kode_barang : request.kode_barang
            }
        })

        if(!BarangHeader) {
            return [null, {code : 409, message : "Barang Tidak Ada"}]
        }

        const updateStatus : any = await TrxBarangPersediaanHeader.update({
            status : 1
        }, {
            where : {
                nomor_dokumen : request.nomor_dokumen,
                kode_barang : request.kode_barang
            },
            transaction : t
        })

        if(!updateStatus) {
            return [null, {code : 409, message : "Data Gagal Update"}]
        }

        for(let x : number = 0 ; x < request.kuantitas ; x++) {
            const barang_akhir : any = await TrxBarangPersediaanDetail.findOne({
                attributes : ["kode_urut"],
                where : {
                    kode_barang_persediaan : request.kode_barang_persediaan
                },
                order : [["kode_urut", "DESC"]],
                limit : 1, 
                transaction : t
            })
            let hasil : number
            if(barang_akhir === null){
                hasil = 1
            }
            else {
                hasil = generatenumber.generateNumber(barang_akhir.kode_urut)
            }
           
            const insert_barang : TrxBarangPersediaanDetail = await TrxBarangPersediaanDetail.create({
                nomor_dokumen : request.nomor_dokumen,
                kode_barang : request.kode_barang,
                kode_barang_persediaan : request.kode_barang_persediaan,
                kode_urut : hasil,
                kode_unit : request.kode_unit,
                nama_barang : request.nama_barang,
                harga_satuan : request.harga_satuan,
                keterangan : request.keterangan,
                satuan : request.satuan,
                tahun : request.tahun,
                kode_gudang : request.kode_gudang,
                pakai_unit :pakai_unit.option1
            }, {transaction : t})
        }
    
        await t.commit()
        return [BarangHeader, null]

    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

const detailBarangUnit =async (
    request:BarangDetailRequest) : Promise <[any | null , any | null]> => {
        const t = await db.transaction()
        try {
        const BarangHeader : TrxBarangPersediaanHeader | null = await TrxBarangPersediaanHeader.findOne({
            where : {
                nomor_dokumen : request.nomor_dokumen,
                kode_barang : request.kode_barang
            }
        })

        if(!BarangHeader) {
            return [null, {code : 409, message : "Barang Tidak Ada"}]
        }

        const updateStatus : any = await TrxBarangPersediaanHeader.update({
            status : 1
        }, {
            where : {
                nomor_dokumen : request.nomor_dokumen,
                kode_barang : request.kode_barang
            },
            transaction : t
        })

        if(!updateStatus) {
            return [null, {code : 409, message : "Data Gagal Update"}]
        }

        for(let x : number = 0 ; x < request.kuantitas ; x++) {
            const barang_akhir : any = await TrxBarangPersediaanDetail.findOne({
                attributes : ["kode_urut"],
                where : {
                    kode_barang_persediaan : request.kode_barang_persediaan
                },
                order : [["kode_urut", "DESC"]],
                limit : 1, 
                transaction : t
            })

            let hasil : number
            if(barang_akhir === null){
                hasil = 1
            }
            else {
                hasil = generatenumber.generateNumber(barang_akhir.kode_urut)
            }

            const insert_barang : TrxBarangPersediaanDetail = await TrxBarangPersediaanDetail.create({
                nomor_dokumen : request.nomor_dokumen,
                kode_barang : request.kode_barang,
                kode_barang_persediaan : request.kode_barang_persediaan,
                kode_urut : hasil,
                kode_unit : request.kode_unit,
                nama_barang : request.nama_barang,
                harga_satuan : request.harga_satuan,
                keterangan : request.keterangan,
                satuan : request.satuan,
                tahun : request.tahun,
                kode_gudang : request.kode_gudang,
                pakai_unit : pakai_unit.option1
            }, {transaction : t})
            if(!insert_barang) {
                return [null, {code : 409, message : "Data Gagal Insert"}]
            }
        }
        
    
        await t.commit()
        return [BarangHeader, null]

    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

const deleteBarang =async (
    request:BarangDetailRequest) : Promise <[any | null , any | null]> => {
    try {
        const BarangPersediaan : TrxBarangPersediaanDetail[] = await TrxBarangPersediaanDetail.findAll({
            where : {
                nomor_dokumen : request.nomor_dokumen,
                kode_barang_persediaan : request.kode_barang_persediaan
            }
        })

        if(BarangPersediaan.length === 0 ) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        const deleteBarang = await TrxBarangPersediaanDetail.destroy({
            where : {
                nomor_dokumen : request.nomor_dokumen,
                kode_barang_persediaan : request.kode_barang_persediaan
            }
        })

        if(!deleteBarang){
            return [null, {code : 400, message : "Data Gagal Dihapus"}]
        }

        return [deleteBarang, null]
    } catch (error : any) {
        return [null, {code : 500, message :error.message}]
    }
}

const kirimKasubag =async (
    request:BarangPromiseRequest) : Promise <[any | null , any | null]> => {
    try {
        const exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
            where : {
                nomor_dokumen : request.nomor_dokumen
            }
        })

        if(!exBast) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        const upBast  = await TrxBastPersediaan.update({
            status : 2,
            alasan : request.alasan
        }, {
            where : {
                nomor_dokumen : request.nomor_dokumen
            }
        })

        if(!upBast) {
            return [null, {code : 409, message : "Data Gagal Update"}]
        }

        return [exBast, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const tolakKasubag =async (
    request:BarangPromiseRequest) : Promise <[any | null , any | null]> => {
    try {
        const exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
            where : {
                nomor_dokumen : request.nomor_dokumen,
                status : 2
            }
        })

        if(!exBast) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        const upBast  = await TrxBastPersediaan.update({
            status : 1,
            alasan : request.alasan
        }, {
            where : {
                nomor_dokumen : request.nomor_dokumen,
                status : 2
            }
        })

        if(!upBast) {
            return [null, {code : 409, message : "Data Gagal Update"}]
        }

        return [exBast, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const kasubagParaf =async (
    request:BarangPromiseRequest) : Promise <[any | null , any | null]> => {
        const t = await db.transaction()
    try {
        const exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
            where : {
                nomor_dokumen : request.nomor_dokumen,
                status : 2
            }
        })

        if(!exBast) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        const upBast = await TrxBastPersediaan.update({
            status : 3
            },{
                where : {
                nomor_dokumen : request.nomor_dokumen,
                status : 2
                },
                transaction : t
            })

        if(!upBast) {
            return [null, {code : 409, message : "Paraf Gagal"}]
        }

        const upBarangPersediaan = await TrxBarangPersediaanDetail.update({
            status_pemakaian : status_pemakaian.option1
        }, {
            where : {
                nomor_dokumen : request.nomor_dokumen
            },
            transaction : t
        })

        if(!upBarangPersediaan) {
            return [null, {code : 409, message : "Gagal Update Barang"}]
        }

        await t.commit()

        return [exBast, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const pembelianUpload = async (
    request: any) : Promise<[any | null , any | null]> => {
    const t = await db.transaction();
    try {
        let array_awal : any = request.barang_bast
        for(let x : number = 0 ; x < array_awal.length ; x++){
            let exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
                where : {
                    nomor_dokumen : array_awal[x].nomor_dokumen,
                    kode_unit : array_awal[x].kode_unit
                },
                transaction : t
            })

            if(exBast){
                // throw new CustomError(499, "Nomor Dokumen Sudah Terpakai")
                await t.rollback()
                return[null, {code : 499, message : "Nomor Dokumen Sudah Terpakai"}]
            }

            let create_bast = await TrxBastPersediaan.create({
                nomor_dokumen : array_awal[x].nomor_dokumen,
                kode_persediaan : array_awal[x].kode_persediaan,
                tanggal_dokumen : array_awal[x].tanggal_dokumen,
                tanggal_pembukuan : array_awal[x].tanggal_pembukuan,
                kode_unit : array_awal[x].kode_unit,
                nilai_total : array_awal[x].nilai_bast, 
            }, {transaction : t})

            if (!create_bast) {
            // throw new CustomError(499, "Gagal Melakukan Insert Data")
            await t.rollback()
            return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
            }

            let array_kedua = array_awal[x].PersediaanHeader.length
            let array_isi = array_awal[x].PersediaanHeader
            

            for (let y : number = 0 ; y < array_kedua ; y++) {
                let harga_satuan_header = array_isi[y].harga_satuan * array_isi[y].jumlah
                let createBarangHeader = await TrxBarangPersediaanHeader.create({
                    nomor_dokumen : array_awal[x].nomor_dokumen,
                    kode_barang : array_isi[y].kode_barang,
                    nama_barang : array_isi[y].nama_barang,
                    jumlah : array_isi[y].jumlah,
                    harga_satuan : array_isi[y].harga_satuan,
                    total : harga_satuan_header,
                    status :1
                }, {transaction :t})
              
                if(!createBarangHeader) {
                    // await t.rollback()
                    // throw new CustomError(499, "Gagal Melakukan Insert Data")

                    await t.rollback()
                    return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
                }


                let array_ketiga = array_isi[y].PersediaanDetail.length
                let array_isi_2 = array_isi[y].PersediaanDetail

                for(let z : number = 0 ; z < array_ketiga ; z++){
                    for(let xx : number = 0 ; xx < array_isi_2[z].kuantitas ; xx++){
                        let checkUrut : any = await TrxBarangPersediaanDetail.findOne({
                            attributes : ["kode_urut"],
                            where : {
                                kode_barang_persediaan : array_isi_2[z].kode_barang_persediaan
                            },
                            order : [["kode_urut", "DESC"]],
                            limit : 1, 
                            transaction : t
                        });
                        
                        let hasil : number
                        if(checkUrut === null){
                            hasil = 1
                        }
                        else {
                            hasil = generatenumber.generateNumber(checkUrut.kode_urut)
                            // console.log("TES :", hasil)
                        }

                      
                        const insert_barang : TrxBarangPersediaanDetail = await TrxBarangPersediaanDetail.create({
                            nomor_dokumen : array_awal[x].nomor_dokumen,
                            kode_barang : array_isi[y].kode_barang,
                            kode_barang_persediaan : array_isi_2[z].kode_barang_persediaan,
                            kode_urut : hasil,
                            kode_unit : array_awal[x].kode_unit,
                            nama_barang : array_isi_2[z].nama_barang,
                            harga_satuan : array_isi_2[z].harga_satuan,
                            keterangan : array_isi_2[z].keterangan,
                            satuan : array_isi_2[z].satuan,
                            tahun : array_isi_2[z].tahun,
                            pakai_unit : pakai_unit.option2,
                            status_pemakaian : status_pemakaian.option1
                        }, {transaction : t})

                        if(!insert_barang) {
                            await t.rollback()
                            return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
                            // throw new CustomError(499, "Data Insert Gagal ")
                        }
                    }
                }
            }
        }   
    // console.log(dataCreate.transaction)
    await t.commit()
    return [array_awal, null]
    } catch (error : any) {
        await t.rollback()
        // Handle transaction or other errors
        // console.error("Transaction error:", error);

        return [null, {code : 500, message : error.message}]
    }
};

const pembelianUpload2 = async (
    request: any) : Promise<[any | null , any | null]> => {
    const t = await db.transaction();
    try {
        let array_awal : any = request.barang_bast
        for(let x : number = 0 ; x < array_awal.length ; x++){
            let exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
                where : {
                    nomor_dokumen : array_awal[x].nomor_dokumen,
                    kode_unit : array_awal[x].kode_unit
                },
                transaction : t
            })

            if(exBast){
                // throw new CustomError(499, "Nomor Dokumen Sudah Terpakai")
                await t.rollback()
                return[null, {code : 499, message : "Nomor Dokumen Sudah Terpakai"}]
            }

            let create_bast = await TrxBastPersediaan.create({
                nomor_dokumen : array_awal[x].nomor_dokumen,
                kode_persediaan : array_awal[x].kode_persediaan,
                tanggal_dokumen : array_awal[x].tanggal_dokumen,
                tanggal_pembukuan : array_awal[x].tanggal_pembukuan,
                kode_unit : array_awal[x].kode_unit,
                nilai_total : array_awal[x].nilai_bast, 
            }, {transaction : t})

            if (!create_bast) {
            // throw new CustomError(499, "Gagal Melakukan Insert Data")
            await t.rollback()
            return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
            }

            let array_kedua = array_awal[x].PersediaanHeader.length
            let array_isi = array_awal[x].PersediaanHeader
            

            for (let y : number = 0 ; y < array_kedua ; y++) {
                let harga_satuan_header = array_isi[y].harga_satuan * array_isi[y].jumlah
                let createBarangHeader = await TrxBarangPersediaanHeader.create({
                    nomor_dokumen : array_awal[x].nomor_dokumen,
                    kode_barang : array_isi[y].kode_barang,
                    nama_barang : array_isi[y].nama_barang,
                    jumlah : array_isi[y].jumlah,
                    harga_satuan : array_isi[y].harga_satuan,
                    total : harga_satuan_header,
                    status :1
                }, {transaction :t})
              
                if(!createBarangHeader) {
                    // await t.rollback()
                    // throw new CustomError(499, "Gagal Melakukan Insert Data")

                    await t.rollback()
                    return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
                }


                let array_ketiga = array_isi[y].PersediaanDetail.length
                let array_isi_2 = array_isi[y].PersediaanDetail

                for(let z : number = 0 ; z < array_ketiga ; z++){
                        let checkUrut : any = await TrxBarangPersediaanDetail2.findOne({
                            attributes : ["kode_urut"],
                            where : {
                                kode_barang_persediaan : array_isi_2[z].kode_barang_persediaan
                            },
                            order : [["kode_urut", "DESC"]],
                            limit : 1, 
                            transaction : t
                        });
                        console.log(checkUrut)
                        let hasil : number
                        if(checkUrut === null){
                            hasil = 1
                        }
                        else {
                            hasil = generatenumber.generateNumber(checkUrut.kode_urut)
                            // console.log("TES :", hasil)
                        }
                        console.log(hasil)
                    const insert_barang : TrxBarangPersediaanDetail2 = await TrxBarangPersediaanDetail2.create({
                            nomor_dokumen : array_awal[x].nomor_dokumen,
                            kode_barang : array_isi[y].kode_barang,
                            kode_barang_persediaan : array_isi_2[z].kode_barang_persediaan,
                            kode_urut : hasil,
                            kode_unit : array_awal[x].kode_unit,
                            nama_barang : array_isi_2[z].nama_barang,
                            harga_satuan : array_isi_2[z].harga_satuan,
                            keterangan : array_isi_2[z].keterangan,
                            satuan : array_isi_2[z].satuan,
                            tahun : array_isi_2[z].tahun,
                            pakai_unit : pakai_unit.option2,
                            status_pemakaian : status_pemakaian.option1,
                            kuantitas : array_isi_2[z].kuantitas,
                            kuantitas_gerak : array_isi_2[z].kuantitas
                    }, {transaction : t})

                    if(!insert_barang) {
                            await t.rollback()
                            return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
                    }
                    // for(let xx : number = 0 ; xx < array_isi_2[z].kuantitas ; xx++){
                    //     let checkUrut : any = await TrxBarangPersediaanDetail.findOne({
                    //         attributes : ["kode_urut"],
                    //         where : {
                    //             kode_barang_persediaan : array_isi_2[z].kode_barang_persediaan
                    //         },
                    //         order : [["kode_urut", "DESC"]],
                    //         limit : 1, 
                    //         transaction : t
                    //     });
                        
                    //     let hasil : number
                    //     if(checkUrut === null){
                    //         hasil = 1
                    //     }
                    //     else {
                    //         hasil = generatenumber.generateNumber(checkUrut.kode_urut)
                    //         // console.log("TES :", hasil)
                    //     }

                      
                    //     const insert_barang : TrxBarangPersediaanDetail = await TrxBarangPersediaanDetail.create({
                    //         nomor_dokumen : array_awal[x].nomor_dokumen,
                    //         kode_barang : array_isi[y].kode_barang,
                    //         kode_barang_persediaan : array_isi_2[z].kode_barang_persediaan,
                    //         kode_urut : hasil,
                    //         kode_unit : array_awal[x].kode_unit,
                    //         nama_barang : array_isi_2[z].nama_barang,
                    //         harga_satuan : array_isi_2[z].harga_satuan,
                    //         keterangan : array_isi_2[z].keterangan,
                    //         satuan : array_isi_2[z].satuan,
                    //         tahun : array_isi_2[z].tahun,
                    //         pakai_unit : pakai_unit.option2,
                    //         status_pemakaian : status_pemakaian.option1
                    //     }, {transaction : t})

                    //     if(!insert_barang) {
                    //         await t.rollback()
                    //         return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
                    //         // throw new CustomError(499, "Data Insert Gagal ")
                    //     }
                    // }
                }
            }
        }   
    // console.log(dataCreate.transaction)
    await t.commit()
    return [array_awal, null]
    } catch (error : any) {
        await t.rollback()
        // Handle transaction or other errors
        // console.error("Transaction error:", error);

        return [null, {code : 500, message : error.message}]
    }
};

const pembelianUpload3 = async (
    request: any) : Promise<[any | null , any | null]> => {
    const t = await db.transaction();
    try {
        let array_awal : any = request.barang_bast
        for(let x : number = 0 ; x < array_awal.length ; x++){
            let exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
                where : {
                    nomor_dokumen : array_awal[x].nomor_dokumen,
                    kode_unit : array_awal[x].kode_unit
                },
                transaction : t
            })

            if(exBast){
                // throw new CustomError(499, "Nomor Dokumen Sudah Terpakai")
                await t.rollback()
                return[null, {code : 499, message : "Nomor Dokumen Sudah Terpakai"}]
            }

            let create_bast = await TrxBastPersediaan.create({
                nomor_dokumen : array_awal[x].nomor_dokumen,
                kode_persediaan : array_awal[x].kode_persediaan,
                tanggal_dokumen : array_awal[x].tanggal_dokumen,
                tanggal_pembukuan : array_awal[x].tanggal_pembukuan,
                kode_unit : array_awal[x].kode_unit,
                nilai_total : array_awal[x].nilai_bast, 
            }, {transaction : t})

            if (!create_bast) {
            // throw new CustomError(499, "Gagal Melakukan Insert Data")
            await t.rollback()
            return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
            }

            let array_kedua = array_awal[x].PersediaanHeader.length
            let array_isi = array_awal[x].PersediaanHeader
            

            for (let y : number = 0 ; y < array_kedua ; y++) {
                let harga_satuan_header = array_isi[y].harga_satuan * array_isi[y].jumlah
                let createBarangHeader = await TrxBarangPersediaanHeader.create({
                    nomor_dokumen : array_awal[x].nomor_dokumen,
                    kode_barang : array_isi[y].kode_barang,
                    nama_barang : array_isi[y].nama_barang,
                    jumlah : array_isi[y].jumlah,
                    harga_satuan : array_isi[y].harga_satuan,
                    total : harga_satuan_header,
                    status : 1
                }, {transaction :t})
              
                if(!createBarangHeader) {
                    // await t.rollback()
                    // throw new CustomError(499, "Gagal Melakukan Insert Data")

                    await t.rollback()
                    return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
                }


                let array_ketiga = array_isi[y].PersediaanDetail.length
                let array_isi_2 = array_isi[y].PersediaanDetail
                let array_insert : any = []

                for(let z : number = 0 ; z < array_ketiga ; z++){
                    let checkUrut : any = await TrxBarangPersediaanDetail3.findOne({
                        attributes : ["kode_urut"],
                        where : {
                            kode_barang_persediaan : array_isi_2[z].kode_barang_persediaan,
                            kode_unit :  array_awal[x].kode_unit,
                        },
                        order : [["kode_urut", "DESC"]],
                        limit : 1, 
                    })

                    console.log("TES ", checkUrut)

                    let hasil: number = 1;
                    if (checkUrut !== null) {
                        hasil = checkUrut.kode_urut;
                        console.log("TES")
                    }

                    for(let xx : number = 0 ; xx < array_isi_2[z].kuantitas ; xx++){
                    
                        
                        // let hasil : number
                        // if(checkUrut === null){
                        //     hasil = 1
                        // }
                        // else {
                        //     hasil = generatenumber.generateNumber(checkUrut.kode_urut)
                        //     // console.log("TES :", hasil)
                        // }
                        console.log("CEK : ", hasil, array_isi_2[z].kode_barang_persediaan, array_awal[x].nomor_dokumen  )
                        array_insert.push({
                            nomor_dokumen : array_awal[x].nomor_dokumen,
                            kode_barang : array_isi[y].kode_barang,
                            kode_barang_persediaan : array_isi_2[z].kode_barang_persediaan,
                            kode_urut : hasil,
                            kode_unit : array_awal[x].kode_unit,
                            nama_barang : array_isi_2[z].nama_barang,
                            harga_satuan : array_isi_2[z].harga_satuan,
                            keterangan : array_isi_2[z].keterangan,
                            satuan : array_isi_2[z].satuan,
                            tahun : array_isi_2[z].tahun,
                            pakai_unit : pakai_unit.option2,
                            status_pemakaian : status_pemakaian.option1
                        })

                       hasil++
                    }
                    // console.log(array_insert)
                    
                    const insert_barang : any = await TrxBarangPersediaanDetail3.bulkCreate(array_insert, {transaction : t})
                    if(insert_barang) {
                        console.log("BERHASIL")
                    }
                    // // console.log(insert_barang)
                    // if(!insert_barang) {
                    //         await t.rollback()
                    //         return[null, {code : 499, message : "Gagal Melakukan Insert Data"}]
                    // }
                }
            }
        }
    
    
   
    // console.log(dataCreate.transaction)
    await t.commit()
    return [array_awal, null]
    } catch (error : any) {
        await t.rollback()
        // Handle transaction or other errors
        // console.error("Transaction error:", error);
        // console.log(error)
        return [null, {code : 500, message : error.message}]
    }
};

const BastBarangPersediaanExist =async (
    kode_unit:string) : Promise<[any | null , any | null]> => {
    try {
        const ExBarangPersediaan : TrxBastPersediaan[] = await TrxBastPersediaan.findAll({
            where : {
                kode_unit : kode_unit
            },
            attributes : [
                'kode_persediaan',
                'tanggal_dokumen',
                'tanggal_pembukuan',
                'nomor_dokumen',
                'nilai_total',
                'file_path'
            ],
            include : [
                {
                    model : TrxBarangPersediaanHeader, 
                    as : 'TrxBarangPersediaanHeader',
                    attributes : [
                        "kode_barang",
                        "nama_barang",
                        "harga_satuan",
                        "total"
                    ]
                },
                {
                    model : JenisPersediaan, 
                    as : "jenispersediaan",
                    attributes : [
                        'kode_persediaan',
                        'nama_persediaan'
                    ]
                }
            ]
        }) 

        if(ExBarangPersediaan.length === 0) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [ExBarangPersediaan, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}


const DetailBarangExist =async (
    kode_barang:string, kode_unit : string, nomor_dokumen: string) : Promise<[any | null , any | null]>=> {
    try {
        const exDetailBarang : TrxBarangPersediaanDetail[] = await TrxBarangPersediaanDetail.findAll({
            where : {
                kode_barang : kode_barang,
                kode_unit : kode_unit, 
                nomor_dokumen : nomor_dokumen,
                status_pemakaian : status_pemakaian.option1,
                pakai_unit : pakai_unit.option2
            },
            attributes : [
                [Sequelize.fn('COUNT', Sequelize.col('kode_urut')), 'kuantitas'],
                "kode_barang_persediaan",
                "nama_barang",
                "harga_satuan"
            ],
            group : ["kode_barang_persediaan", "harga_satuan"]
        })

        if (!exDetailBarang) {
            return [null, {code : 499, message : "Data Detail Barang Tidak Ada"}]
        }
        return [exDetailBarang, null]
    } catch (error : any) {
        return[null, {code : 500, message : error.message}]
    }
}

const DetailBarangExist2 =async (
    kode_barang:string, kode_unit : string, nomor_dokumen: string) : Promise<[any | null , any | null]>=> {
    try {
        const exDetailBarang : TrxBarangPersediaanDetail2[] = await TrxBarangPersediaanDetail2.findAll({
            where : {
                kode_barang : kode_barang,
                kode_unit : kode_unit, 
                nomor_dokumen : nomor_dokumen,
                status_pemakaian : status_pemakaian.option1,
                pakai_unit : pakai_unit.option2
            },
            attributes : [
                [Sequelize.fn('COUNT', Sequelize.col('kode_urut')), 'kuantitas'],
                "kode_barang_persediaan",
                "nama_barang",
                "harga_satuan"
            ],
            group : ["kode_barang_persediaan", "harga_satuan"]
        })

        if (!exDetailBarang) {
            return [null, {code : 499, message : "Data Detail Barang Tidak Ada"}]
        }
        return [exDetailBarang, null]
    } catch (error : any) {
        return[null, {code : 500, message : error.message}]
    }
}

const uploadFileBast =async (
    nomor_dokumen:string, file: any)  : Promise<[any | null , any | null]> => {
    try {
        const exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findByPk(nomor_dokumen)

        if (!exBast) {
            return [null, {code : 499, message : "Data BAST Tidak Ada"}]
        }

        const existFile: any = exBast.file_path

        // console.log("TES DATA : ",existFile)

        if(file && file.filename){
            const PUBLIC_FILE_BAST = `${process.env.HOST_ASSET}${process.env.PUBLIC_FILE_BAST}/${file.filename}`;

            exBast.file_path = PUBLIC_FILE_BAST
        }

        const response = await exBast.save()

        // console.log("TES DATA : ", file.file_path)

        if(!response){
            throw new CustomError(499, "Gagal Update BAST")
        }
        let part
        let lastPart
        if(existFile){
            part = existFile.split("/")
            lastPart = part[part.length - 1] 
            // console.log(lastPart)

            if(file && file.path){
                // console.log(file.path)
                let unlink = await fs.unlink(path.join(__dirname,`../../../src/public/pdf/bast/${lastPart}`))
                console.log(unlink)
               
            }
        }

        return [exBast, null]
    } catch (error : any) {
        if (error instanceof CustomError) {
            if (file && file.path) {
              await removeFile(file.path);
            }
        throw new CustomError(500, error.message)
    }
        else {
            throw new CustomError(500, error.message)
        }
    }
}
const hapusBastByUnit =async (
    kode:string) : Promise<[any | null , any | null]> => {
        const t = await db.transaction()
    try {
        const exBast : TrxBastPersediaan[] = await TrxBastPersediaan.findAll({
            where : {
                kode_unit : kode
            },
            raw : true,
            transaction : t
        })

        if(exBast.length === 0) {
            return [null, {code : 500, message : "Data Tidak Ada"}]
        } 

        const data_bast : TrxBarangPersediaanDetail[] = await TrxBarangPersediaanDetail.findAll({
            where : {
                kode_unit : kode,
                status_pemakaian : 'BarangTerpakai',
            },
            transaction : t 
        })

        if (data_bast.length != 0) {
            return[null, {code : 499, message : "Data Sudah Terpakai"}]
        }


        const hapusBast = await TrxBastPersediaan.destroy({
            where : {
                kode_unit : kode
            },
            transaction : t
        })

        if(!hapusBast){
           
            return [null, {code : 499, message : "Data Gagal Hapus"}]
        }

        let hapus_data = exBast.map(async (item: any) => {
            const delete_header = await TrxBarangPersediaanHeader.destroy({
              where: {
                nomor_dokumen: item.nomor_dokumen,
              },
              transaction: t,
            });
      
            if (!delete_header) {
              return [null, { code: 499, message: "Data Header Gagal Hapus" }];
            }
      
            const delete_detail = await TrxBarangPersediaanDetail.destroy({
              where: {
                nomor_dokumen: item.nomor_dokumen,
              },
              transaction: t,
            });
      
            if (!delete_detail) {
              return [null, { code: 499, message: "Data Detail Gagal Hapus" }];
            }
          });

        await Promise.all(hapus_data)
        await t.commit()
        return [exBast, null]
        
    } catch (error : any) {
        t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}



//================================================ FLOW IDEAL ================================================

//STORE KE PENAMPUNG
const storeDataPromiseNew = async (
    request:StoreBarangPromiseNew) :  Promise<[any | null, any | null]>  => {
    const t = await db.transaction()
    try {
        const exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findOne({
            where : {
                nomor_dokumen : request.nomor_dokumen
            },
            transaction  : t
        })

        if(exBast) {
            return [null, {code : 499, message : "Data Sudah Ada"}]
        }

        const newBast : TrxBastPersediaan = await TrxBastPersediaan.create({
            nomor_dokumen : request.nomor_dokumen,
            nama_penyedia : request.nama_penyedia,
            tanggal_dokumen : request.tanggal_dokumen,
            tanggal_pembukuan : request.tanggal_pembukuan,
            nilai_total : request.nilai_total,
            kode_persediaan : request.kode_persediaan,
            kode_unit : request.kode_unit,
            alasan : request.alasan,
            status : 1,
            ucr : request.ucr,
        },{transaction : t})

        if(!newBast) {
            return [null, {code : 499, message : "Gagal Input Data"}]
        }

        let arrayPromise = request.BarangPromise
        let BarangPromise = []
        for(const dataArray of arrayPromise) {
            const penampungExist : TrxBarangPenampung | null= await TrxBarangPenampung.findOne(
                {
                    where : {
                        nomor_dokumen : request.nomor_dokumen,
                        kode_barang_persediaan : dataArray.kode_barang_persediaan,
                        harga_satuan : dataArray.harga_satuan
                    }
                }
            )
            if(penampungExist !== null) {
                return [null, {code : 499, message : "Data Input Doubel"}]
            }

            const kode_barang = dataArray.kode_barang_persediaan.substring(0,9)

            const penampungInsert : TrxBarangPenampung = await TrxBarangPenampung.create({
                kode_barang_persediaan : dataArray.kode_barang_persediaan,
                kode_barang : kode_barang,
                nomor_dokumen : request.nomor_dokumen,
                tahun : request.tahun,
                kode_unit : request.kode_unit,
                harga_satuan : dataArray.harga_satuan,
                kuantitas : dataArray.kuantitas,
                harga_total : dataArray.kuantitas * dataArray.harga_satuan
            }, {transaction : t})

            if(!penampungInsert) {
                return [null, {code : 499, message : "Data Input Penampung Gagal"}]
            }

            BarangPromise.push(penampungInsert)
        }

        const updateData = await axios.put(`${process.env.HOST_PROMISE}/api/eksternal/update_aset_persedian`, {
            "modul" : "sibela",
            "penyedia" : "dpt",
            "id_permintaan" : request.id_permintaan
        })

        t.commit()

        return [newBast, null]
    } catch (error : any) {
        t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

//UBAH KODE BARANG
const ubahKodeBarang = async (
    kode_urut:number, request:Omit<RequestBarangPromise,
    "kuantitas" |
    "satuan" | 
    "harga_satuan" | 
    "harga_total">
    ) :  Promise<[any | null, any | null]>   => {
    try {
        const exBarangPenampung : TrxBarangPenampung | null = await TrxBarangPenampung.findByPk(kode_urut)

        if(!exBarangPenampung) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }
        exBarangPenampung.kode_barang_persediaan= request.kode_barang_persediaan
        exBarangPenampung.uch= request.uch

        const kode_barang = request.kode_barang_persediaan.substring(0,9)

        exBarangPenampung.kode_barang = kode_barang

        const response = await exBarangPenampung.save()
        // console.log(response)
        if(!response) {
            return [null, {code:499, message : "Data Gagal Ubah"}]
        }

        return [exBarangPenampung, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const kirimKasubagNew = async (
    nomor_dokumen:string) :  Promise<[any | null, any | null]>  => {
    try {
        const exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findByPk(nomor_dokumen)

        if(!exBast) {
            return [null, {code : 499, message : "Data Bast Tidak Ada"}]
        }

        exBast.status = 2

        const response = await exBast.save()

        if(!response) {
            return [null, {code : 499, message : "Gagal Kirim Kasubag"}]
        }

        return [exBast, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const storeDataParafKasubag = async (
    nomor_dokumen:string, tanggal_pembukuan : Date) :  Promise<[any | null, any | null]>  => {
    const t = await db.transaction()
    try {
        console.log(nomor_dokumen)
        const exBast : TrxBastPersediaan | null = await TrxBastPersediaan.findByPk(nomor_dokumen)

        if(!exBast) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        exBast.status = 3;
        exBast.tanggal_pembukuan = tanggal_pembukuan
        
        const response = await exBast.save({transaction : t})

        if(!response) {
            return [null, {code : 499, message : "Gagal Merubah Status"}]
        }

        const exBarangPenampung : TrxBarangPenampung[] = await TrxBarangPenampung.findAll({
            where : {
                nomor_dokumen : nomor_dokumen
            },
            raw : true,
            transaction : t
        })

        if(exBarangPenampung.length === 0) {
            return [null, {code : 499, message : "Data Detail Barang Tidak Ada"}]
        }

        for(const dataPenampung of exBarangPenampung ) {
            const detailBarang : TrxBarangPersediaanDetail2 | null =  await TrxBarangPersediaanDetail2.findOne({
                attributes : [
                    "kode_urut"
                ],
                where : {
                    kode_barang_persediaan : dataPenampung.kode_barang_persediaan
                },
                order : [["kode_urut", "DESC"]],
                transaction : t
            })
            let kode_urut
            if(detailBarang === null) {
                kode_urut = 1
            } 
            else {
                kode_urut = generatenumber.generateNumber(detailBarang.kode_urut || 0)
            }
            console.log("KODE URUT : ", kode_urut)

            let insertDetailBarang : TrxBarangPersediaanDetail2 = await TrxBarangPersediaanDetail2.create({
                nomor_dokumen : nomor_dokumen,
                kode_barang : dataPenampung.kode_barang,
                kode_barang_persediaan : dataPenampung.kode_barang_persediaan,
                tahun : dataPenampung.tahun,
                kode_urut : kode_urut,
                kode_unit : dataPenampung.kode_unit,
                harga_satuan : dataPenampung.harga_satuan,
                status_pemakaian : status_pemakaian.option1,
                pakai_unit : pakai_unit.option1,
                kuantitas : dataPenampung.kuantitas,
                kuantitas_gerak : dataPenampung.kuantitas
            }, {transaction : t})
            
            if(!insertDetailBarang) {
                return [null, {code : 499, message : "Data Detail Barang Gagal Masuk"}]
            }
        }

        await t.commit()

        return [exBarangPenampung, null]
    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

const getDataStorePromise = async ()  :  Promise<[any | null, any | null]> => {
    try {
        const BarangBast : TrxBastPersediaan[] = await TrxBastPersediaan.findAll({
            where : {
                kode_persediaan : 2,
                status : 1
            },
            include : [
                {
                    model : TrxBarangPenampung,
                    as : "trxbarangpenampung", 
                    attributes : {
                        exclude : ['uch','udch']
                    }
                }
            ],
            order : [["udcr","ASC"]]
        })

        if(BarangBast.length === 0) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [BarangBast, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const getDataKasubag = async () :  Promise<[any | null, any | null]> => {
    try {
        const BarangBast : TrxBastPersediaan[] = await TrxBastPersediaan.findAll({
            where : {
                kode_persediaan : 2,
                status : 2
            },
            include : [
                {
                    model : TrxBarangPenampung,
                    as : "trxbarangpenampung", 
                    attributes : {
                        exclude : ['uch','udch']
                    }
                }
            ],
            order : [["udcr","ASC"]]
        })

        if(BarangBast.length === 0) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [BarangBast, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const getDataAkhir = async () :  Promise<[any | null, any | null]> => {
    try {
        const BarangBast : TrxBastPersediaan[] = await TrxBastPersediaan.findAll({
            where : {
                kode_persediaan : 2,
                status : 3
            },
            include : [
                {
                    model : TrxBarangPersediaanDetail2,
                    as : "trxpersediaandetail2", 
                    attributes : {
                        exclude : ['uch','udch']
                    }
                }
            ],
            order : [["udcr","ASC"]]
        })


        if(BarangBast.length === 0) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [BarangBast, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

export default {
    getBarangPromise,
    getBarangPromiseProses,
    storeDataPromise,
    detailBarang,
    detailBarangUnit,
    deleteBarang,    
    getForm,
    kirimKasubag,
    kasubagParaf,
    tolakKasubag,
    pembelianUpload,
    BastBarangPersediaanExist,
    DetailBarangExist,
    uploadFileBast,
    hapusBastByUnit, 
    pembelianUpload2,
    pembelianUpload3,
    DetailBarangExist2,
    //FLOW IDEAL 
    storeDataPromiseNew,
    ubahKodeBarang,
    kirimKasubagNew,
    storeDataParafKasubag,
    getDataStorePromise,
    getDataKasubag,
    getDataAkhir
}