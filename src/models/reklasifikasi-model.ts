import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export interface IReklasifikasiAttributes  {
    trx_barang_persediaan : string,
	tanggal_rekam? : Date | undefined,
	kode_barang_persediaan_awal : number,
	kode_barang_persediaan_baru : number,
	keterangan : string | null,
	status: string,
	ucr : string | null,
	uch : string | null,
	udch? : Date | undefined,
	udcr? : Date | undefined,
}

class TrxReklasifikasi 
extends Model<IReklasifikasiAttributes,Optional<IReklasifikasiAttributes,"udch" | "udcr">>
implements IReklasifikasiAttributes {
    declare trx_barang_persediaan : string;
	declare tanggal_rekam? : Date | undefined;
	declare kode_barang_persediaan_awal : number;
	declare kode_barang_persediaan_baru : number;
	declare keterangan : string | null;
	declare status: string;
	declare ucr : string | null;
	declare uch : string | null;
	declare udch? : Date | undefined;
	declare udcr? : Date | undefined;
}

TrxReklasifikasi.init (
    {
        trx_barang_persediaan : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey: true
        },
	    tanggal_rekam : {
            type : DataTypes.DATE(),
            allowNull : true,
        },
	    kode_barang_persediaan_awal : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
	    kode_barang_persediaan_baru : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
	    keterangan : {
            type : DataTypes.STRING(100),
            allowNull : true
        },
	    status : {
            type : DataTypes.STRING(100),
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
        tableName : "trx_reklasifikasi",
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default TrxReklasifikasi