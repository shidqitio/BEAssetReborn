import {  DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IJenisPersediaanAttributes {
    kode_persediaan : string, 
	nama_persediaan : string, 
	ucr : string, 
	uch : string, 
	udch? : Date | undefined,
	udcr? : Date | undefined,
}

class JenisPersediaan 
extends Model<IJenisPersediaanAttributes,Optional<IJenisPersediaanAttributes, "udcr" | "udch">>
implements IJenisPersediaanAttributes {
    declare kode_persediaan : string;
	declare nama_persediaan : string;
	declare ucr : string;
	declare uch : string;
	declare udch? : Date | undefined;
	declare udcr? : Date | undefined;
} 

JenisPersediaan.init(
    {
        kode_persediaan : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true
        },
        nama_persediaan : {
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
        udch : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        udcr : {
            type : DataTypes.DATE(),
            allowNull : true
        },
    },
    {
        sequelize : db,
        tableName : "ref_jenis_persediaan",
        modelName : "JenisPersediaan",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default JenisPersediaan