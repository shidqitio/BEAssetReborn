import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import TrxBastPersediaan from "./trxbast-model";


export interface ITrxBarangPersediaanHeaderAttributes {
    kode_barang : string | null,
	nomor_dokumen : string | null,
	nama_barang : string | null,
	jumlah : number | null,
	harga_satuan : number | null,
	total : number | null,
	status : number | null,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxBarangPersediaanHeader
extends Model<ITrxBarangPersediaanHeaderAttributes, Optional<ITrxBarangPersediaanHeaderAttributes, 
    "kode_barang" |
    "nomor_dokumen" |
    "nama_barang" |
    "jumlah" |
    "harga_satuan" |
    "total" |
    "status" |
    "udch" | 
    "udcr">>
implements ITrxBarangPersediaanHeaderAttributes {
    declare kode_barang : string | null;
	declare nomor_dokumen : string | null;
	declare nama_barang : string | null;
	declare jumlah : number | null;
	declare harga_satuan : number | null;
	declare total : number | null;
	declare status : number | null;
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