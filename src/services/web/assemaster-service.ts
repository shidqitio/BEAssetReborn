import RefAssetBaru3 from "../../models/refassetbaru3-model";
import RefAssetBaru4 from "../../models/refassetbaru4-model";
import RefAssetBaru5 from "../../models/refassetbaru5-model";
import RefAssetBaru6 from "../../models/refassetbaru6-model";
import AssetPersediaan from "../../models/assetpersediaan-model";
import { RefAssetBaru4Request, RefAssetBaru5Request, RefAssetBaru6Request, AssetPersediaanRequest } from "../../controllers/web/assetmaster-controller";



const RefAssetBaru3byId =async (
    )  : Promise<[any | null, any | null]> => {
    try {
        const Asset : RefAssetBaru3[] = await RefAssetBaru3.findAll({
            attributes : {exclude : ['udch']}
        })

        return [Asset, null]
    } catch (error :  any) {
        return [null, {code : 500, message : error.meesage}]
    }
}

const RefAssetBaru4byId =async (
    kode:string) : Promise<[any | null, any | null]> => {
    try {
        const Asset : RefAssetBaru4[] = await RefAssetBaru4.findAll({
            where : {
                kode_asset_3 : kode
            }
        })
        if(Asset.length === 0) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [Asset, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.meesage}]
    }
}

const RefAssetBaru5byId =async (
    kode:string) : Promise<[any | null, any | null]> => {
    try {
        const Asset : RefAssetBaru5[] = await RefAssetBaru5.findAll({
            where : {
                kode_asset_4 : kode
            }
        })
        if(Asset.length === 0) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [Asset, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.meesage}]
    }
}

const RefAssetBaru6byId =async (
    kode:string) : Promise<[any | null, any | null]> => {
    try {
        const Asset : RefAssetBaru6[] = await RefAssetBaru6.findAll({
            where : {
                kode_asset_5 : kode
            }
        })
        if(Asset.length === 0) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [Asset, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.meesage}]
    }
}

const RefAssetPersediaan =async (
    kode:string) : Promise<[any | null, any | null]> => {
    try {
        const Asset : AssetPersediaan[] = await AssetPersediaan.findAll({
            where : {
                kode_asset_6 : kode
            }
        })
        if(Asset.length === 0) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        return [Asset, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.meesage}]
    }
}

const AddAssetBaru4 =async (
    kode:string, request: RefAssetBaru4Request) : Promise<[any | null, any | null]>  => {
    try {
        const exAsset : RefAssetBaru4[] = await RefAssetBaru4.findAll({
            where : {
                kode_asset_3 : kode
            },
            raw :true
        }) 

        if(exAsset.length === 0 ) {
            return [null, {code : 499, message : "Data Tidak Ada"}]
        }

        // Find the object with the largest kode_asset_4 value
        let largestObject = exAsset.reduce((maxObject, currentObject) => {
            const currentKodeAsset = parseFloat(currentObject.kode_asset_4);
            const maxKodeAsset = parseInt(maxObject.kode_asset_4);
            return currentKodeAsset > maxKodeAsset ? currentObject : maxObject;
        });

        let data_kode : any = parseFloat(largestObject.kode_asset_4) + 1


        const createKode4 = await RefAssetBaru4.create({
            kode_asset_3 : largestObject.kode_asset_3,
            kode_asset_4 : data_kode.toString(),
            uraian_kelompok : request.uraian_kelompok
        })

        if(!createKode4){
            return [null, {code : 499, message : "Data Insert Gagal"}]
        }

        return[exAsset, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const AddAssetBaru5 =async (
    kode:string, request: RefAssetBaru5Request) : Promise<[any | null, any | null]>  => {
    try {
        const exAsset : RefAssetBaru5[] = await RefAssetBaru5.findAll({
            where : {
                kode_asset_4 : kode
            },
            raw :true
        }) 

        let createKode5

        if(exAsset.length === 0 ) {
            let checkData = await RefAssetBaru4.findOne({
                where : {
                    kode_asset_4 : kode
                }
            })

            if(!checkData) {
                return [null, {code : "499", message : "Kode yang diinput tidak ada"}]
            }

            let kode_baru : string = checkData.kode_asset_4 + "01"

            createKode5 = await RefAssetBaru5.create({
                kode_asset_4 : checkData.kode_asset_4,
                kode_asset_5 : kode_baru,
                uraian_sub_kelompok : request.uraian_sub_kelompok
            })

            if(!createKode5){
                return [null, {code : 499, message : "Data Insert Gagal"}]
            }
        }

        else {
            // Find the object with the largest kode_asset_4 value
            let largestObject = exAsset.reduce((maxObject, currentObject) => {
                const currentKodeAsset = parseFloat(currentObject.kode_asset_5);
                const maxKodeAsset = parseInt(maxObject.kode_asset_5);
                return currentKodeAsset > maxKodeAsset ? currentObject : maxObject;
            });
    
            let data_kode : any = parseFloat(largestObject.kode_asset_5) + 1
    
    
            createKode5 = await RefAssetBaru5.create({
                kode_asset_4 : largestObject.kode_asset_4,
                kode_asset_5 : data_kode.toString(),
                uraian_sub_kelompok : request.uraian_sub_kelompok
            })
    
        }

        if(!createKode5){
            return [null, {code : 499, message : "Data Insert Gagal"}]
        }


        return[createKode5, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const AddAssetBaru6 =async (
    kode:string, request: RefAssetBaru6Request) : Promise<[any | null, any | null]>  => {
    try {
        const exAsset : RefAssetBaru6[] = await RefAssetBaru6.findAll({
            where : {
                kode_asset_5 : kode
            },
            raw :true
        }) 

        let createKode6
        if(exAsset.length === 0 ) {
            let checkData = await RefAssetBaru5.findOne({
                where : {
                    kode_asset_5 : kode
                }
            })

            if(!checkData) {
                return [null, {code : "499", message : "Kode yang diinput tidak ada"}]
            }

            let kode_baru : string = checkData.kode_asset_5 + "01"

            createKode6 = await RefAssetBaru6.create({
                kode_asset_5 : checkData.kode_asset_5,
                kode_asset_6 : kode_baru,
                uraian_sub_sub_kelompok : request.uraian_sub_sub_kelompok
            })

            if(!createKode6){
                return [null, {code : 499, message : "Data Insert Gagal"}]
            }
        }
        else {
            // Find the object with the largest kode_asset_4 value
            let largestObject = exAsset.reduce((maxObject, currentObject) => {
                const currentKodeAsset = parseFloat(currentObject.kode_asset_6);
                const maxKodeAsset = parseInt(maxObject.kode_asset_6);
                return currentKodeAsset > maxKodeAsset ? currentObject : maxObject;
            });
    
            let data_kode : any = parseFloat(largestObject.kode_asset_6) + 1
    
    
            createKode6 = await RefAssetBaru6.create({
                kode_asset_5 : largestObject.kode_asset_5,
                kode_asset_6 : data_kode.toString(),
                uraian_sub_sub_kelompok : request.uraian_sub_sub_kelompok
            })
    
            if(!createKode6){
                return [null, {code : 499, message : "Data Insert Gagal"}]
            }
        }


        return[createKode6, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

const AddAssetBaruPersediaan =async (
    kode:string, request: AssetPersediaanRequest) : Promise<[any | null, any | null]>  => {
    try {
        const exAsset : AssetPersediaan[] = await AssetPersediaan.findAll({
            where : {
                kode_asset_6 : kode
            },
            raw :true
        }) 

        let createKode7
        if(exAsset.length === 0 ) {
            let checkData = await RefAssetBaru6.findOne({
                where : {
                    kode_asset_6 : kode
                }
            })

            if(!checkData) {
                return [null, {code : "499", message : "Kode yang diinput tidak ada"}]
            }

            let kode_baru : string = checkData.kode_asset_6 + "0001"

            createKode7 = await AssetPersediaan.create({
                kode_asset_6 : checkData.kode_asset_6,
                kode_barang_persediaan : kode_baru,
                nama_persediaan : request.nama_persediaan,
                satuan : request.satuan
            })

            if(!createKode7){
                return [null, {code : 499, message : "Data Insert Gagal"}]
            }
        }
        else {
            // Find the object with the largest kode_asset_4 value
            let largestObject = exAsset.reduce((maxObject, currentObject) => {
                const currentKodeAsset = parseFloat(currentObject.kode_barang_persediaan);
                const maxKodeAsset = parseInt(maxObject.kode_barang_persediaan);
                return currentKodeAsset > maxKodeAsset ? currentObject : maxObject;
            });
    
            let data_kode : any = parseFloat(largestObject.kode_barang_persediaan) + 1
    
    
            createKode7 = await AssetPersediaan.create({
                kode_asset_6 : largestObject.kode_asset_6,
                kode_barang_persediaan : data_kode.toString(),
                nama_persediaan : request.nama_persediaan,
                satuan : request.satuan
            })
    
            if(!createKode7){
                return [null, {code : 499, message : "Data Insert Gagal"}]
            }
        }


        return[createKode7, null]
    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}

export default {
RefAssetBaru3byId,
RefAssetBaru4byId,
RefAssetBaru5byId,
RefAssetBaru6byId,
RefAssetPersediaan,
AddAssetBaru4,
AddAssetBaru5,
AddAssetBaru6,
AddAssetBaruPersediaan
}