import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IKartuAttributes {
    kode_kartu : string,
	nama_kartu : string,
	ucr : string,
	uch : string,
	udcr? : Date | undefined,
	udch? : Date | undefined,
}

class RefKartu
extends Model<IKartuAttributes,Optional<IKartuAttributes,"udch" | "udcr">>
implements IKartuAttributes {
    declare kode_kartu : string;
	declare nama_kartu : string;
	declare ucr : string;
	declare uch : string;
	declare udcr? : Date | undefined;
	declare udch? : Date | undefined;
}


RefKartu.init(
    {
        kode_kartu : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
        nama_kartu : {
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
        tableName : "ref_kartu",
        modelName : "RefKartu",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default RefKartu