import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IGolonganAttributes {
    kode_golongan : string,
	nama_golongan : string,
	ucr : string,
	uch : string,
	udcr? : Date,
	udch? : Date,
}

class RefGolongan 
extends Model<IGolonganAttributes, Optional<IGolonganAttributes,"udch" | "udcr">>
implements IGolonganAttributes {
    declare kode_golongan : string;
	declare nama_golongan : string;
	declare ucr : string;
	declare uch : string;
	declare udcr? : Date | undefined;
	declare udch? : Date | undefined
}

RefGolongan.init(
    {
        kode_golongan : {
            type : DataTypes.STRING(1),
            allowNull : false,
            primaryKey : true
        },
        nama_golongan : {
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
        tableName : "ref_golongan",
        modelName : "RefGolongan",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default RefGolongan