import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IRefAssetBaru3Attributes {
	kode_asset_2 : string | null,
	kode_asset_3 : string | null,
	uraian_bidang : string | null,
	udcr : Date | null,
	udch : Date | null,
}

class RefAssetBaru3 
extends Model<IRefAssetBaru3Attributes, Optional<IRefAssetBaru3Attributes, "udch" | "udcr">>
implements IRefAssetBaru3Attributes {
	declare kode_asset_2 : string | null ;
	declare kode_asset_3 : string | null ;
	declare uraian_bidang : string | null ;
	declare udcr : Date | null ;
	declare udch : Date | null ;
}


RefAssetBaru3.init(
    {
        kode_asset_2 : {
          type : DataTypes.STRING(),
          allowNull :true,  
        },
        kode_asset_3 : {
          type : DataTypes.STRING(),
          allowNull :false, 
          primaryKey : true 
        },
        uraian_bidang : {
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
        tableName : "ref_asset_baru_3",
        modelName : "RefAssetBaru3",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)



export default RefAssetBaru3