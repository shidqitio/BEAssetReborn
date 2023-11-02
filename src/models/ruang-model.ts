import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IRuangAttributes {
    kode_ruang : number,
	kd_ruang : string | null,
	nip : string,
	nama_pj : string,
	kode_unit : string,
	nama_unit : string,
	nama_ruang : string,
	ucr : string,
	uch : string,
	udcr : Date | null,
	udch : string | null,
}

class RefRuang 
extends Model<IRuangAttributes,Optional<IRuangAttributes,"kode_ruang" | "udch"|"udcr">>
implements IRuangAttributes {
    declare kode_ruang : number;
	declare kd_ruang : string | null;
	declare nip : string;
	declare nama_pj : string;
	declare kode_unit : string;
	declare nama_unit : string;
	declare nama_ruang : string;
	declare ucr : string;
	declare uch : string;
	declare udcr : Date | null;
	declare udch : string | null;
}

RefRuang.init (
    {
        kode_ruang : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey :true,
            autoIncrement : true
        },
        kd_ruang : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        nip : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        nama_pj : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_unit : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        nama_unit : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        nama_ruang : {
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
        tableName : "ref_ruang",
        modelName : "RefRuang",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default RefRuang