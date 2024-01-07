import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IRefAssetBaru4Attributes {
    kode_coa_4 : string | null,
	kode_asset_3 : string | null,
	kode_asset_4 : string | null,
	uraian_kelompok : string | null,
	udcr : Date | null,
	udch : Date | null,
}

class RefAssetBaru4 
extends Model<IRefAssetBaru4Attributes, Optional<IRefAssetBaru4Attributes, "udch" | "udcr">>
implements IRefAssetBaru4Attributes {
    declare kode_coa_4 : string | null ;
	declare kode_asset_3 : string | null ;
	declare kode_asset_4 : string | null ;
	declare uraian_kelompok : string | null ;
	declare udcr : Date | null ;
	declare udch : Date | null ;
}


RefAssetBaru4.init(
    {
        kode_coa_4 : {
          type : DataTypes.STRING(),
          allowNull :true,  
        },
        kode_asset_3 : {
          type : DataTypes.STRING(),
          allowNull :true,  
        },
        kode_asset_4 : {
          type : DataTypes.STRING(),
          allowNull :false, 
          primaryKey : true 
        },
        uraian_kelompok : {
          type : DataTypes.STRING(),
          allowNull :true,  
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
        tableName : "ref_asset_baru_4",
        modelName : "RefAssetBaru4",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)



export default RefAssetBaru4