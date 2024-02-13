import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import JenisPersediaan from "./jenispersediaan-model";

export interface ITrxBastPersediaanAttributes {
    kode_persediaan : number | null,
	nomor_dokumen : string,
	nama_penyedia : string | null,
	tanggal_dokumen : Date | undefined,
	tanggal_pembukuan : Date | undefined,
	nilai_total : number | null,
	kode_unit : string,
	status : number,
	alasan : Text | null,
    file_path : string | null,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxBastPersediaan 
extends Model<ITrxBastPersediaanAttributes, Optional<ITrxBastPersediaanAttributes, "udch" | "udcr" | "kode_persediaan" | "status">>
implements ITrxBastPersediaanAttributes {
    declare kode_persediaan : number | null;
	declare nomor_dokumen : string;
	declare nama_penyedia : string | null;
	declare tanggal_dokumen : Date | undefined;
	declare tanggal_pembukuan : Date | undefined;
	declare nilai_total : number | null;
	declare kode_unit : string;
	declare status : number;
	declare alasan : Text | null;
    declare file_path : string | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}


TrxBastPersediaan.init(
    {
        kode_persediaan : {
            type : DataTypes.INTEGER(),
            allowNull : true,
        },
        nomor_dokumen : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
        nama_penyedia : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        tanggal_dokumen : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        tanggal_pembukuan : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        nilai_total : {
            type : DataTypes.DECIMAL(20,2),
            allowNull : true
        },
        kode_unit : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        status : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        alasan : {
            type : DataTypes.TEXT(),
            allowNull : true
        },
        file_path : {
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
        tableName : "trx_bast_persediaan",
        modelName : "TrxBastPersediaan",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxBastPersediaan.belongsTo(JenisPersediaan, {
    foreignKey : "kode_persediaan",
    as : "jenispersediaan"
})

JenisPersediaan.hasMany(TrxBastPersediaan, {
    foreignKey : "kode_persediaan",
    as : "trxbastpersediaan"
})


export default TrxBastPersediaan