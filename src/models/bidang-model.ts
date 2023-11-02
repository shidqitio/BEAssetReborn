import {  DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import RefGolongan from "./golongan-model";

export interface IBidangAttributes {
    kode_golongan : string,
	kode_bidang : string,
	jenis_bidang : string,
	ucr : string,
	uch : string,
	udcr? : Date | undefined,
	udch? : Date | undefined,
}

class RefBidang 
extends Model<IBidangAttributes,Optional<IBidangAttributes, "udcr" | "udch">>
implements IBidangAttributes 
{ 
    declare kode_golongan : string;
	declare kode_bidang : string;
	declare jenis_bidang : string;
	declare ucr : string;
	declare uch : string;
	declare udcr? : Date | undefined;
	declare udch? : Date | undefined;
}

RefBidang.init(
    {
        kode_golongan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    kode_bidang : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
	    jenis_bidang : {
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
            type : DataTypes.DATE,
            allowNull : true
        },
	    udch : {
            type : DataTypes.DATE,
            allowNull : true
        },
    },
    {
        sequelize : db,
        tableName : "ref_bidang",
        modelName : "RefBidang",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

RefBidang.belongsTo(RefGolongan, {
    foreignKey : "kode_golongan", 
    as : "refgolongan"
})

RefGolongan.hasMany(RefBidang, {
    foreignKey : "kode_golongan", 
    as : "refbidang"
})

export default RefBidang