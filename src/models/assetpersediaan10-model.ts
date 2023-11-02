import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IAssetPersediaan10Attributes {
    kode_asset : string
	nama_asset : string
	ucr : string | null
	uch : string | null
	udcr? : Date | undefined
	udch? : Date | undefined
}

class AssetPersediaan10
extends Model<IAssetPersediaan10Attributes, Optional<IAssetPersediaan10Attributes, "udch" | "udcr">>
implements IAssetPersediaan10Attributes {
    declare kode_asset : string;
	declare nama_asset : string;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr? : Date | undefined;
	declare udch?: Date | undefined;
}

AssetPersediaan10.init(
    {
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
            type : DataTypes.STRING(),
            allowNull : true
        },
	    udch : {
            type : DataTypes.STRING(),
            allowNull : true
        },
    },
    {
        sequelize : db,
        tableName : "ref_asset_persediaan_10",
        modelName : "AssetPersediaan10",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default AssetPersediaan10