import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import AssetPersediaan10 from "./assetpersediaan10-model";

export interface IAssetPersediaanAttributes {
    kode_asset : string,
	kode_barang_persediaan : string,
	nama_persediaan : string,
	satuan : string,
	ucr : string | null,
	uch : string | null,
	udcr? : Date | undefined,
	udch? : Date | undefined,
}

class AssetPersediaan 
extends Model<IAssetPersediaanAttributes, Optional<IAssetPersediaanAttributes, "udch" | "udcr">>
implements IAssetPersediaanAttributes {
    declare kode_asset : string ;
	declare kode_barang_persediaan : string ;
	declare nama_persediaan : string ;
	declare satuan : string ;
	declare ucr : string | null ;
	declare uch : string | null ;
	declare udcr? : Date | undefined ;
	declare udch? : Date | undefined ;
}


AssetPersediaan.init(
    {
        kode_asset : {
            type : DataTypes.STRING(),
            allowNull : false
        },
	    kode_barang_persediaan : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
	    nama_persediaan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    satuan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    ucr : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    uch : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    udcr : {
            type : DataTypes.DATE(),
            allowNull : true
        },
	    udch : {
            type : DataTypes.DATE(),
            allowNull : true
        },
    },
    {
        sequelize : db,
        tableName : "ref_asset_persediaan",
        modelName : "AssetPersediaan",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

AssetPersediaan.belongsTo(AssetPersediaan10, {
    foreignKey : "kode_asset",
    as : "AssetPersediaan10"
})

AssetPersediaan10.hasMany(AssetPersediaan, {
    foreignKey : "kode_asset",
    as : "AssetPersediaan"
})

export default AssetPersediaan