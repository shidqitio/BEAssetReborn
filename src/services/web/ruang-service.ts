import RefRuang from "../../models/ruang-model";
import DaftarBarang from "../../models/daftarbarang-model";
import { Op } from "sequelize";
import db from "../../config/database";
import { RuangRequest } from "../../controllers/web/ruang-controller";

const getRuangAll =async (
    page : number,
    limit : number
)  : Promise<[any | null, any | null]>  => {
    try {
        let offset = 0 ;

        if(page > 1 ) {
            offset = (page - 1) * limit ;
        }

        const ruang : RefRuang[] = await RefRuang.findAll({
            attributes : {exclude : ['udcr','udch']},
            limit : limit,
            offset : offset
        })

        return [ruang,null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const getRuangByUnit =async (
    kode:string) : Promise<[any | null, any | null]> => {
    try {
        const ruang : RefRuang[] = await RefRuang.findAll({
            attributes : {exclude : ['udcr','udch']},
            where : {
                kode_unit : kode
            },
            include : [
                {
                    model : DaftarBarang,
                    as : "daftarbarang", 
                    attributes : {exclude : ["udcr", "udch"]}
                }
            ]
        })

        if(ruang.length === 0) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        return [ruang, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const storeRuang =async (
    request : RuangRequest
) : Promise<[any | null, any | null]>   => {
    try {
         const newRuang : RefRuang = await RefRuang.create({
            kd_ruang : request.kd_ruang,
            nip : request.nip,
            nama_pj : request.nama_pj,
            kode_unit : request.kode_unit,
            nama_unit : request.nama_unit,
            nama_ruang : request.nama_ruang,
            ucr : request.ucr,
            uch : request.uch,
         })

         if(!newRuang) {
            return [null, {code : 409, message : "Data Gagal Ditambahkan"}]
         }

         return [newRuang, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const updateRuang =async (
    kode:number,
    request:Omit<RuangRequest, "kode_ruang">
    ) : Promise<[any | null, any | null]> => {
    try {
        const ruang : RefRuang | null = await RefRuang.findByPk(kode)
        if(!ruang) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        ruang.kd_ruang =request.kd_ruang;
        ruang.nip =request.nip;
        ruang.nama_pj =request.nama_pj;
        ruang.kode_unit =request.kode_unit;
        ruang.nama_unit =request.nama_unit;
        ruang.nama_ruang =request.nama_ruang;
        ruang.ucr =request.ucr;
        ruang.uch =request.uch;
        ruang.udcr =request.udcr;
        ruang.udch =request.udch;

        const response = await ruang.save()
        if(!response) {
            return [null, {code : 400, message : "Data Gagal Update"}]
        }

        return [ruang, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const deleteRuang =async (
    kode:number) : Promise<[any | null, any | null]> => {
    try {
        const ruang : RefRuang | null = await RefRuang.findByPk(kode)

        if(!ruang) {
            return [null, {code : 401, message : "Data Tidak Ada"}]
        }

        const destroyResult = await RefRuang.destroy({
            where : {
                kode_ruang : kode
            }
        })

        if(!destroyResult){
            return [null, {code : 400, message : "Data Gagal Dihapus"}]
        }

        return [destroyResult, null]
    } catch (error : any) {
        return[null, {code : 500, message : error.message}]
    }
}

const assetByRuang =async (
    kode:string) : Promise<[any | null, any | null]> => {
        try {
            const ruang : RefRuang[] = await RefRuang.findAll({
                attributes : {exclude : ['udcr','udch']},
                where : {
                    kode_ruang : kode
                },
                include : [
                    {
                        model : DaftarBarang,
                        as : "daftarbarang", 
                        attributes : {exclude : ["udcr", "udch"]}
                    }
                ]
            })
    
            if(ruang.length === 0) {
                return [null, {code : 409, message : "Data Tidak Ada"}]
            }
    
            return [ruang, null]
        } catch (error : any) {
            return [null, {code : 500, message : error.message}]
        }
}

export default {
    getRuangAll,
    getRuangByUnit,
    storeRuang,
    updateRuang,
    deleteRuang,
    assetByRuang
}

