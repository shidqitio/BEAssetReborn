import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import RefAssetBaru4 from "./refassetbaru4-model";

export interface IRefAssetBaru5Attributes {
    kode_coa_5 : string | null,
	kode_asset_4 : string,
	kode_asset_5 : string,
	uraian_sub_kelompok : string | null,
	udcr : Date | null,
	udch : Date | null,
}

class RefAssetBaru5 
extends Model<IRefAssetBaru5Attributes, Optional<IRefAssetBaru5Attributes, "udch" | "udcr">>
implements IRefAssetBaru5Attributes {
    declare kode_coa_5 : string | null ;
	declare kode_asset_4 : string;
	declare kode_asset_5 : string ;
	declare uraian_sub_kelompok : string | null ;
	declare udcr : Date | null ;
	declare udch : Date | null ;
}


RefAssetBaru5.init(
    {
        kode_coa_5 : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_asset_4 : {
            type : DataTypes.STRING(),
            allowNull : false
        },
        kode_asset_5 : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey :true
        },
        uraian_sub_kelompok : {
            type : DataTypes.STRING(),
            allowNull : true
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
        tableName : "ref_asset_baru_5",
        modelName : "RefAssetBaru5",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

RefAssetBaru5.belongsTo(RefAssetBaru4, {
    foreignKey : "kode_asset_4",
    as : "kodeasset4"
})

RefAssetBaru4.hasMany(RefAssetBaru5, {
    foreignKey : "kode_asset_4",
    as : "kodeasset5"
})


export default RefAssetBaru5