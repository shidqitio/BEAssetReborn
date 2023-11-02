import RefAsset from "../../models/asset-model";
import RefBidang from "../../models/bidang-model";
import RefGolongan from "../../models/golongan-model";
import RefKartu from "../../models/kartu-model";
import { Op } from "sequelize";

const getRefAsset =async (page : number, limit : number)  : Promise<[any | null, any | null]> => {
    try {
        let offset = 0 ;

        if(page > 1 ) {
            offset = (page - 1) * limit ;
        }

        const asset : RefAsset[] = await RefAsset.findAll({
            include : [
                {
                    model : RefBidang,
                    as : "refbidang",
                    attributes : {exclude : ["udcr", "udch"]},
                    include : [
                        {
                            model : RefGolongan,
                            as : "refgolongan"
                        }
                    ]
                },
                {
                    model : RefKartu, 
                    as : "refkartu",
                    attributes : {exclude : ["udcr", "udch"]}
                }
            ],
            attributes: {
                exclude : ['ucr','uch' ]
            },
            limit : limit,
            offset : offset
        })

        return [asset, null]
        
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const getAssetById =async (
    kode:string
    ): Promise<[any | null, any | null]>  => {
    try {
        const asset : RefAsset | null = await RefAsset.findOne({
            where : {
                kode_asset : kode
            },
            include : [
                {
                    model : RefBidang,
                    as : "refbidang",
                    attributes : {exclude : ["udcr", "udch"]},
                    include : [
                        {
                            model : RefGolongan,
                            as : "refgolongan"
                        }
                    ]
                },
                {
                    model : RefKartu, 
                    as : "refkartu",
                    attributes : {exclude : ["udcr", "udch"]}
                }
            ],
        });

        if(!asset) {
            return [null, {code : 401, message : "Data Asset Tidak Ada"}]
        }

        return [asset, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const getAssetByNama =async (
    nama_asset:string
    ): Promise<[any | null, any | null]> => {
    try {
        const assets : RefAsset[] = await RefAsset.findAll({
            where : {
                nama_asset : {
                    [Op.like] : `%${nama_asset}%`
                }
            },
            include : [
                {
                    model : RefBidang,
                    as : "refbidang",
                    attributes : {exclude : ["udcr", "udch"]},
                    include : [
                        {
                            model : RefGolongan,
                            as : "refgolongan"
                        }
                    ]
                },
                {
                    model : RefKartu, 
                    as : "refkartu",
                    attributes : {exclude : ["udcr", "udch"]}
                }
            ],
        })

        if(!assets) {
            return [null, {code : 401, message : "Data Asset Tidak Ada"}]
        }

        return [assets, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

export default {
    getRefAsset,
    getAssetById,
    getAssetByNama
}