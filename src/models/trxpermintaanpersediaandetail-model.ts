import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import TrxPermintaanPersediaanHeader from "./trxpermintaanpersediaanheader-model";

export enum status_tolak {
    option1 = "terima",
    option2 = "tolak_kasubag",
    option3 = "tolak_gudang"
}

export interface ITrxPermintaanPersediaanDetail {
    kode_permintaan_persediaan : number | null,
	id_permintaan : string | null,
	kode_barang_persediaan : string | null,
	nama_barang_persediaan : string | null,
	jumlah : number | null,
	jumlah_disetujui : number | null,
	satuan : string | null,
	keterangan : string | null,
	status_tolak : status_tolak | null,
	alasan : string | null,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxPermintaanPersediaanDetail 
extends Model<ITrxPermintaanPersediaanDetail, 
Optional<ITrxPermintaanPersediaanDetail, "udch" | "udcr" | "kode_permintaan_persediaan">>
implements ITrxPermintaanPersediaanDetail {
    declare kode_permintaan_persediaan : number | null;
	declare id_permintaan : string | null;
	declare kode_barang_persediaan : string | null;
	declare nama_barang_persediaan : string | null;
	declare jumlah : number | null;
	declare jumlah_disetujui : number | null;
	declare satuan : string | null;
	declare keterangan : string | null;
	declare status_tolak : status_tolak | null;
	declare alasan : string | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

TrxPermintaanPersediaanDetail.init (
    {
        kode_permintaan_persediaan : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
	    id_permintaan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    kode_barang_persediaan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    nama_barang_persediaan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    jumlah : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
	    jumlah_disetujui : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
	    satuan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    keterangan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    status_tolak : {
            type : DataTypes.ENUM('terima','tolak_kasubag','tolak_gudang'),
            allowNull : true
        },
	    alasan : {
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
        tableName : "trx_permintaan_persediaan_detail",
        modelName : "TrxPermintaanPersediaanDetail",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxPermintaanPersediaanDetail.belongsTo(TrxPermintaanPersediaanHeader, {
    foreignKey : "id_permintaan", 
    as : "PermintaanHeader"
})

TrxPermintaanPersediaanHeader.hasMany(TrxPermintaanPersediaanDetail, {
    foreignKey : "id_permintaan",
    as : "PermintaanDetail"
})

export default TrxPermintaanPersediaanDetail
