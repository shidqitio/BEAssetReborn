import { BelongsTo, DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import RefBidang from "./bidang-model";
import RefKartu from "./kartu-model";

export interface IAssetAttributes {
    kode_asset_6 : string | null,
	kode_asset : string,
	nama_asset : string | null,
	ucr : string | null,
	uch : string | null,
	udcr? : Date | undefined,
	udch? : Date | undefined,
}

class RefAsset
extends Model<IAssetAttributes,Optional<IAssetAttributes,"udch" | "udcr">>
implements IAssetAttributes {
    declare kode_asset_6 : string | null;
	declare kode_asset : string;
	declare nama_asset : string | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr? : Date | undefined;
	declare udch? : Date | undefined;
}

RefAsset.init(
    {
        kode_asset_6 : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_asset : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
        nama_asset : {
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
        tableName : "ref_asset",
        modelName : "RefAsset",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)



export default RefAsset