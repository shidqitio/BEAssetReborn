import RefAsset from "../../models/asset-model";
import DaftarBarang from "../../models/daftarbarang-model";
import RefPembukuan from "../../models/pembukuan-model";
import { ArrayOption, PembukuanRequest } from "../../controllers/web/pembukuan-controller";
import { DaftarBarangRequest } from "../../controllers/web/daftarbarang-controller";
import { Op } from "sequelize";
import generatenumber from "../../utils/generatenumber";
import db from "../../config/database";

const getPembukuan =async (
    page:number, 
    limit:number) : Promise<[any | null, any | null]> => {
    try {
        let offset = 0 ;

        if(page > 1 ) {
            offset = (page - 1) * limit ;
        }

        const pembukuan : RefPembukuan[] = await RefPembukuan.findAll({
            attributes : {exclude : ["udcr","udch"]},
            include : [
                {
                    model : DaftarBarang,
                    as : "daftarbarang",
                    attributes : {exclude : ["udcr", "udch"]},
                    include : [
                        {
                            model : RefAsset,
                            as : "refasset",
                            attributes : {exclude : ["udcr", "udch"]},
                        }
                    ]
                }
            ],
            limit : limit,
            offset : offset
        })

        return [pembukuan, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const storePembukuan =async (
    request :PembukuanRequest
) : Promise<[any | null, any | null]> => {
    const t = await db.transaction()
    try {
        
        let no_sppa : string
        let ins_sppa : string
        let kode_barang : number
        console.log("=============== STEP 1 =====================")
        const exPembukuan : RefPembukuan[] = await RefPembukuan.findAll({
            where : {
                no_sppa : request.no_sppa
            }
        })
        console.log("============== STEP 2 =====================")
        if(exPembukuan.length === 0) {
            ins_sppa = request.no_sppa + 1
        } 
        else {
            const data_parse : any =  JSON.parse(JSON.stringify(exPembukuan))
            let index : any = exPembukuan.length
            const {kode_pembukuan} : any = data_parse[index - 1]
            no_sppa = request.no_sppa
            let hasil : number = parseInt(kode_pembukuan.substring(5));
            let hasil_akhir : string = JSON.stringify(generatenumber.generateNumber(hasil))
            ins_sppa = no_sppa + hasil_akhir
        }
        const newPembukuan : RefPembukuan = await RefPembukuan.create({
            no_sppa : request.no_sppa,
	        kode_pembukuan : ins_sppa,
	        jumlah_barang : request.jumlah_barang ,
	        asal_perolehan : request.asal_perolehan,
	        no_bukti_perolehan : request.no_bukti_perolehan,
	        tanggal_perolehan : request.tanggal_perolehan,
	        tanggal_pembukuan : request.tanggal_pembukuan,
	        keterangan : request.keterangan,
	        total_nilai : request.total_nilai,
	        pdf : request.pdf,
	        ucr : request.ucr,
            uch : request.uch
        }, {transaction : t})
         
        if(!newPembukuan) {
            return [null, {code : 409, message : "Data Gagal Insert"}]
        }

        // const exDaftarBarang : DaftarBarang[] = await DaftarBarang.findAll({
        //     where : {
        //         kode_pembukuan : ins_sppa
        //     }
        // })


        const daftarbarangrequest: any[] = request.DaftarBarangRequest.map((item:DaftarBarangRequest) => {
            return  {
                kode_barang      : item.kode_barang,
                kode_pembukuan   : ins_sppa,
                kode_asset       : item.kode_asset,
                merk             : item.merk,
                tanggal_perolehan: item.tanggal_perolehan,
                kode_ruang       : item.kode_ruang,
                deskripsi        : item.deskripsi,
                nilai_item       : item.nilai_item,
                kondisi          : item.kondisi,
                optional_key     : item.optional_key,
                umur_ekonomis    : item.umur_ekonomis,
                dasar_harga      : item.dasar_harga,
                metode_penyusutan: item.metode_penyusutan
            }
        })


        const createDaftarBarang : DaftarBarang[]  = await DaftarBarang.bulkCreate(daftarbarangrequest, {transaction : t})
        
        if(!createDaftarBarang) {
            return [null, {code : 409, message : "Data Bulk Gagal Insert"}]
        }

        const sumpembukuan : number = await DaftarBarang.sum("nilai_item", {
            where : {
                kode_pembukuan : ins_sppa
            }, 
            transaction : t
        });

        const countpembukuan : number = await DaftarBarang.count({
            where : {
                kode_pembukuan : ins_sppa 
            },
            transaction : t
        })

        console.log("============ STEP 3 ===================")
        console.log("Count : ", countpembukuan)
        const updatePembukuan : any = await RefPembukuan.update({
            jumlah_barang : countpembukuan, 
            total_nilai : sumpembukuan
        }, {
            where : {
                kode_pembukuan : ins_sppa
            },
            transaction : t
        })

        if(!updatePembukuan) {
            return [null, {code : 409, message : "Update Pembukuan Gagal"}]
        }
        
        await t.commit()
        
        return [newPembukuan, null]

    } catch (error:any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

export default {
    getPembukuan,
    storePembukuan
}