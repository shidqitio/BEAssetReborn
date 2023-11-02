import { DataTypes, Model, Optional } from "sequelize";
import RefAsset from "./asset-model";
import RefPembukuan from "./pembukuan-model";
import db from "../config/database";

export enum SumberDana {
    "APBN",
    "NON APBN"
}

export interface IKibBangunanAttributes {
    kode_status_pemilik : string,
	kode_asset : string,
	no_kib_bangunan : number,
	no_asset : number,
	kode_pembukuan : string,
	luas_bangunan : number,
	nup : string | null,
	luas_dasar_bangunan : number,
	jumlah_lantai : number,
	type : string,
	tahun_bangun : string,
	tahun_guna : string,
	pdf : string,
	lokasi_bangunan : string,
	nup_tanah : string,
	kode_unit : string,
	nama_unit : string,
	sumber_dana : SumberDana,
	no_dana : string,
	tanggal_dana : Date | undefined,
	nilai_wajar : number,
	njop : number,
	catatan : string,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class KibBangunan 
extends Model<IKibBangunanAttributes,Optional<IKibBangunanAttributes, "udch"|"udcr"|"no_asset"|"no_kib_bangunan">>
implements IKibBangunanAttributes {
    declare kode_status_pemilik : string;
	declare kode_asset : string;
	declare no_kib_bangunan : number;
	declare no_asset : number;
	declare kode_pembukuan : string;
	declare luas_bangunan : number;
	declare nup : string | null;
	declare luas_dasar_bangunan : number;
	declare jumlah_lantai : number;
	declare type : string;
	declare tahun_bangun : string;
	declare tahun_guna : string;
	declare pdf : string;
	declare lokasi_bangunan : string;
	declare nup_tanah : string;
	declare kode_unit : string;
	declare nama_unit : string;
	declare sumber_dana : SumberDana;
	declare no_dana : string;
	declare tanggal_dana : Date | undefined;
	declare nilai_wajar : number;
	declare njop : number;
	declare catatan : string;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

KibBangunan.init(
    {
    kode_status_pemilik : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	kode_asset : {
        type : DataTypes.INTEGER(),
        allowNull : true
    },
	no_kib_bangunan : {
        type : DataTypes.INTEGER(),
        allowNull : true
    },
	no_asset : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	kode_pembukuan : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	luas_bangunan : {
        type : DataTypes.DECIMAL(12,2),
        allowNull : true
    },
	nup : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	luas_dasar_bangunan : {
        type : DataTypes.DECIMAL(12,2),
        allowNull : true
    },
	jumlah_lantai : {
        type : DataTypes.INTEGER(),
        allowNull : true
    },
	type : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	tahun_bangun : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	tahun_guna : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	pdf : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	lokasi_bangunan : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	nup_tanah : {
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
	sumber_dana : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	no_dana : {
        type : DataTypes.STRING(),
        allowNull : true
    },
	tanggal_dana : {
        type : DataTypes.DATE(),
        allowNull : true
    },
	nilai_wajar : {
        type : DataTypes.DECIMAL(20,2),
        allowNull : true
    },
	njop : {
        type : DataTypes.DECIMAL(20,2),
        allowNull : true
    },
	catatan : {
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
        tableName : "trx_kib_bangunan",
        modelName : "KibBangunan",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default KibBangunan