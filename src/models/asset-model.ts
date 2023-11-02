import { BelongsTo, DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import RefBidang from "./bidang-model";
import RefKartu from "./kartu-model";

export interface IAssetAttributes {
    kode_bidang : string,
	kode_kartu : string,
	kode_asset : string,
	nama_asset : string,
	ucr : string,
	uch : string,
	udcr? : Date | undefined,
	udch? : Date | undefined,
}

class RefAsset
extends Model<IAssetAttributes,Optional<IAssetAttributes,"udch" | "udcr">>
implements IAssetAttributes {
    declare kode_bidang : string;
	declare kode_kartu : string;
	declare kode_asset : string;
	declare nama_asset : string;
	declare ucr : string;
	declare uch : string;
	declare udcr? : Date | undefined;
	declare udch? : Date | undefined;
}

RefAsset.init(
    {
        kode_bidang : {
            type : DataTypes.STRING(),
            allowNull : false
        },
        kode_kartu : {
            type : DataTypes.STRING(),
            allowNull : false
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


RefAsset.belongsTo(RefBidang, {
    foreignKey : "kode_bidang",
    as : "refbidang"
})

RefBidang.hasMany(RefAsset, {
    foreignKey : "kode_bidang",
    as : "refasset"
})

RefAsset.belongsTo(RefKartu, {
    foreignKey : "kode_kartu",
    as : "refkartu"
})

RefKartu.hasMany(RefAsset, {
    foreignKey : "kode_kartu",
    as : "refasset"
})

export default RefAsset