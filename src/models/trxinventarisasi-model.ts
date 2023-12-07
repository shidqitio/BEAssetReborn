import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import DaftarBarang from "./daftarbarang-model";
import RefRuang from "./ruang-model";

export enum JenisUsulan {
    identifikasi = 'identifikasi',
    catatan = 'catatan',
    usulan = 'usulan'
}

export enum Kondisi {
    Baik = 'Baik',
    RusakRingan = 'Rusak Ringan',
    RusakBerat = 'Rusak Berat'
}

export interface ITrxInventarisasiAttributes {
    kode_trx_inventarisasi : number | null,
	kode_barang : number | null,
    kode_asset : string | null,
	nup : string | null,
	nup_barang_baru : string | null,
	jenis_usulan : JenisUsulan | null,
	komentar : string | null,
	status : number | null,
    kode_ruang :number | null,
	tahun_perolehan : string | null,
    tanggal_perolehan : Date | null,
	merk : string | null,
	kondisi : Kondisi | null,
	keterangan : string | null,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxInventarisasi 
extends Model<ITrxInventarisasiAttributes, 
Optional<ITrxInventarisasiAttributes, "kode_trx_inventarisasi"|"udch"|"udcr">>
implements ITrxInventarisasiAttributes {
    declare kode_trx_inventarisasi : number ;
    declare kode_asset : string | null;
	declare kode_barang : number | null;
	declare nup : string | null;
	declare nup_barang_baru : string | null;
	declare jenis_usulan : JenisUsulan ;
	declare komentar : string | null;
	declare status : number | null;
    declare kode_ruang :number | null;
	declare tahun_perolehan : string | null;
    declare tanggal_perolehan : Date | null;
	declare merk : string | null;
	declare kondisi : Kondisi ;
	declare keterangan : string | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

TrxInventarisasi.init (
    {
        kode_trx_inventarisasi : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_asset : {
            type : DataTypes.STRING(), 
            allowNull : true
        },
	    kode_barang : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
	    nup : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    nup_barang_baru : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    jenis_usulan : {
            type : DataTypes.ENUM('identifikasi','catatan','usulan'),
            allowNull : true
        },
	    komentar : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    status : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_ruang : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
	    tahun_perolehan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        tanggal_perolehan : {
            type : DataTypes.DATE(),
            allowNull : true
        },
	    merk : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    kondisi : {
            type : DataTypes.ENUM('Baik','Rusak Ringan','Rusak'),
            allowNull : true
        },
	    keterangan : {
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
        tableName : "trx_inventarisasi",
        modelName : "TrxInventarisasi",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxInventarisasi.belongsTo(DaftarBarang, {
    foreignKey : "nup",
    as : "daftarbarang"
})

DaftarBarang.hasMany(TrxInventarisasi, {
    foreignKey : "nup", 
    as : "trxinventarisasi"
})

TrxInventarisasi.belongsTo(RefRuang, {
    foreignKey : "kode_ruang",
    as : "refruang"
})

RefRuang.hasMany(TrxInventarisasi, {
    foreignKey : "kode_ruang",
    as : "trxinventarisasi"
})


export default TrxInventarisasi