import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import RefAssetBaru5 from "./refassetbaru5-model";

export interface IRefAssetBaru6Attributes {
    kode_coa_6 : string | null,
	kode_asset_5 : string,
	kode_asset_6 : string,
	uraian_sub_sub_kelompok : string,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class RefAssetBaru6 
extends Model<IRefAssetBaru6Attributes, Optional<IRefAssetBaru6Attributes, "udch" | "udcr">>
implements IRefAssetBaru6Attributes {
    declare kode_coa_6 : string | null ;
	declare kode_asset_5 : string ;
	declare kode_asset_6 : string ;
	declare uraian_sub_sub_kelompok : string ;
	declare udcr : Date | undefined ;
	declare udch : Date | undefined ;
}


RefAssetBaru6.init(
    {
        kode_coa_6: {
            type : DataTypes.STRING(),
            allowNull :true
        },
	    kode_asset_5: {
            type : DataTypes.STRING(),
            allowNull :true
        },
	    kode_asset_6: {
            type : DataTypes.STRING(),
            allowNull :false,
            primaryKey :true
        },
	    uraian_sub_sub_kelompok: {
            type : DataTypes.STRING(),
            allowNull :true
        },
	    udcr: {
            type : DataTypes.DATE(),
            allowNull :true
        },
	    udch: {
            type : DataTypes.DATE(),
            allowNull :true
        },
    },
    {
        sequelize : db,
        tableName : "ref_asset_baru_6",
        modelName : "RefAssetBaru6",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

RefAssetBaru6.belongsTo(RefAssetBaru5, {
    foreignKey : "kode_asset_5",
    as : "kodeasset5"
})

RefAssetBaru5.hasMany(RefAssetBaru6, {
    foreignKey : "kode_asset_5",
    as : "kodeasset6"
})


export default RefAssetBaru6