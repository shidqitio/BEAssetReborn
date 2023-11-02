import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import TrxBastPersediaan from "./trxbast-model";


export interface ITrxBarangPersediaanHeaderAttributes {
    kode_barang : string,
	nomor_dokumen : string,
	nama_barang : string,
	jumlah : number,
	harga_satuan : number,
	total : number,
	status : number,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxBarangPersediaanHeader
extends Model<ITrxBarangPersediaanHeaderAttributes, Optional<ITrxBarangPersediaanHeaderAttributes, "udch" | "udcr">>
implements ITrxBarangPersediaanHeaderAttributes {
    declare kode_barang : string;
	declare nomor_dokumen : string;
	declare nama_barang : string;
	declare jumlah : number;
	declare harga_satuan : number;
	declare total : number;
	declare status : number;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

TrxBarangPersediaanHeader.init(
    {
        kode_barang : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
	    nomor_dokumen : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
	    nama_barang : {
            type : DataTypes.STRING(),
            allowNull : true,
        },
	    jumlah : {
            type : DataTypes.INTEGER(),
            allowNull : true,
        },
	    harga_satuan : {
            type : DataTypes.DECIMAL(20,2),
            allowNull : true,
        },
	    total : {
            type : DataTypes.DECIMAL(20,2),
            allowNull : true,
        },
	    status : {
            type : DataTypes.INTEGER(),
            allowNull : true,
        },
	    ucr : {
            type : DataTypes.STRING(),
            allowNull : true,
        },
	    uch : {
            type : DataTypes.STRING(),
            allowNull : true,
        },
	    udcr : {
            type : DataTypes.DATE(),
            allowNull : true,
        },
	    udch : {
            type : DataTypes.DATE(),
            allowNull : true,
        },
    },
    {
        sequelize : db,
        tableName : "trx_barang_persediaan_header",
        modelName : "TrxBarangPersediaanHeader",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxBarangPersediaanHeader.belongsTo(TrxBastPersediaan, {
    foreignKey : "nomor_dokumen",
    as : "TrxBast"
})

TrxBastPersediaan.hasMany(TrxBarangPersediaanHeader, {
    foreignKey : "nomor_dokumen",
    as : "TrxBarangPersediaanHeader"
})

export default TrxBarangPersediaanHeader