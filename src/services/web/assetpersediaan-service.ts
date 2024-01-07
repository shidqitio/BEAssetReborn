import AssetPersediaan from "../../models/assetpersediaan-model";
import { AssetPersediaanRequest } from "../../controllers/web/assetpersediaan-controller";
import RefAssetBaru6 from "../../models/refassetbaru6-model";


const getAll =async () : Promise<[any | null, any | null]> => {
    try {
        const asset_persediaan : AssetPersediaan[] = await AssetPersediaan.findAll({
            attributes : {exclude : ['udcr', 'udch', 'ucr', 'uch']},
            include : [
                {
                    model : RefAssetBaru6, 
                    as : "refasset6",
                    attributes : {exclude : ['udcr', 'udch', 'ucr', 'uch']},
                }
            ]
        })

        return [asset_persediaan, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}


const getById =async (
    kode:string) : Promise<[any | null, any | null]> => {
    try {
        const asset_persediaan : AssetPersediaan | null = await AssetPersediaan.findOne({
            where : {
                kode_barang_persediaan : kode
            },
             attributes : {exclude : ['udcr', 'udch', 'ucr', 'uch']},
            include : [
                {
                    model : RefAssetBaru6, 
                    as : "refasset6",
                     attributes : {exclude : ['udcr', 'udch', 'ucr', 'uch']},
                }
            ]
        })

        if(!asset_persediaan) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        return [asset_persediaan,null]
    } catch (error : any) {
        return [null, {code : 500, meesage : error.message}]
    }
}

const createAsset = async (request : AssetPersediaanRequest) : Promise<[any | null, any | null]> => {
    try {
        const asset_persediaan : AssetPersediaan | null = await AssetPersediaan.findOne({
            where : {
                kode_barang_persediaan : request.kode_asset
            }
        })

        if(asset_persediaan) {
            return [null, {code : 409, message : "Data Sudah Ada"}]
        }

        const newAsset : AssetPersediaan = await AssetPersediaan.create({
            kode_asset_6 : request.kode_asset,
            kode_barang_persediaan : request.kode_barang_persediaan,
            nama_persediaan : request.nama_persediaan,
            satuan : request.satuan,
            ucr : request.ucr,
        })

        if(!newAsset) {
            return [null, {code : 409, message : "Data Gagal Insert"}]
        }

        return [newAsset, null]
    } catch (error : any) {
        console.log("TES")
        return [null, {code : 500, message : error.message}]
    }
}

const updateAsset =async (
    kode_barang_persediaan:string, 
    request : Omit<AssetPersediaanRequest,"kode_barang_persediaan"> ) : Promise<[any | null, any | null]> => {
    try {
        const asset : AssetPersediaan | null = await AssetPersediaan.findByPk(kode_barang_persediaan)

        if(!asset) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }
        asset.kode_asset_6      = request.kode_asset;
        asset.nama_persediaan = request.nama_persediaan;
        asset.satuan          = request.satuan;
        asset.uch            = request.uch;

        const response = await asset.save()
        
        if(!response) {
            return [null, {code : 409, message : "Data Gagal Update"}]
        }

        return [asset, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const hapusAssetPersediaan =async (
    kode:string) : Promise<[any | null, any | null]> => {
    try {
        const asset : AssetPersediaan | null = await AssetPersediaan.findOne({
            where :  {
                kode_barang_persediaan : kode
            }
        }) 
    
        if(!asset) {
            return [null, {code : 409, message : "Data Tidak Ada"}]
        }     

        const hapusData  = await AssetPersediaan.destroy({
            where : {
                kode_asset_6 : kode
            }
        })

        if(!hapusData) {
            return [null, {code : 409, message : "Data Gagal Dihapus"}]
        }

        return [hapusData, null]
    } catch (error : any) {
       return [null, {code : 500, message : error.message}]
    }
}

export default {
    getAll,
    getById,
    createAsset,
    updateAsset,
    hapusAssetPersediaan,
}