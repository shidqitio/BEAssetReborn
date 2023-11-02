import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";

export enum status_aktif {
    option1 = "AKTIF",
    option2 = "NONAKTIF"
}

export enum jasa_ekspedisi {
    option1 = "eksternal",
    option2 = "internal"
}

export enum jenis_permintaan {
    option1 = "ATK",
    option2 = "WISUDA",
    option3 = "SOSPROM"
}

export interface ITrxPermintaanPersediaanHeader {
    id_permintaan : string,
	urut : number | null,
	kode_unit : string | null,
	nama_unit : string | null,
	jasa_ekspedisi : jasa_ekspedisi | null,
	nama_ekspedisi : string | null,
	no_resi : string | null,
	paraf_kasubag : string | null,
	tahun : string | null,
	status : number | null,
	status_aktif : status_aktif | null,
	jenis_permintaan : jenis_permintaan | null,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxPermintaanPersediaanHeader 
extends Model<ITrxPermintaanPersediaanHeader, Optional<ITrxPermintaanPersediaanHeader, "udch" | "udcr">>
implements ITrxPermintaanPersediaanHeader {
    declare id_permintaan : string;
	declare urut : number | null;
	declare kode_unit : string | null;
	declare nama_unit : string | null;
	declare jasa_ekspedisi : jasa_ekspedisi | null;
	declare nama_ekspedisi : string | null;
	declare no_resi : string | null;
	declare paraf_kasubag : string | null;
	declare tahun : string | null;
	declare status : number | null;
	declare status_aktif : status_aktif | null;
	declare jenis_permintaan : jenis_permintaan | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

TrxPermintaanPersediaanHeader.init(
    {
        id_permintaan : {
            type : DataTypes.STRING(),
            allowNull : false
        },
        urut : {
            type : DataTypes.INTEGER(),
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
        jasa_ekspedisi : {
            type : DataTypes.ENUM("eksternal","internal"),
            allowNull : true
        },
        nama_ekspedisi : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_resi : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        paraf_kasubag : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        tahun : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        status : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        status_aktif : {
            type : DataTypes.ENUM("AKTIF", "NONAKTIF"),
            allowNull : true
        },
        jenis_permintaan : {
            type : DataTypes.ENUM("ATK", "WISUDA", "SOSPROM"),
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
        tableName : "trx_permintaan_persediaan_header",
        modelName : "TrxPermintaanPersediaanHeader",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default TrxPermintaanPersediaanHeader