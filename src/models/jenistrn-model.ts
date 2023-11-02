import {  DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IJenistrnAttributes {
    no_sppa : string, 
	kode_trn : string, 
	jenis_trn : string, 
	ucr : string, 
	uch : string, 
	udch? : Date | undefined,
	udcr? : Date | undefined,
}

class RefJenistrn 
extends Model<IJenistrnAttributes,Optional<IJenistrnAttributes, "udcr" | "udch">>
implements IJenistrnAttributes {
    declare no_sppa : string;
	declare kode_trn : string;
	declare jenis_trn : string;
	declare ucr : string;
	declare uch : string;
	declare udch? : Date | undefined;
	declare udcr? : Date | undefined;
} 

RefJenistrn.init(
    {
        no_sppa : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
        kode_trn : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        jenis_trn : {
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
        tableName : "ref_jenis_trn",
        modelName : "RefJenistrn",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default RefJenistrn