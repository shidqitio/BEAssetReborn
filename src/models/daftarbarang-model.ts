import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import RefPembukuan from "./pembukuan-model";
import RefRuang from "./ruang-model";

export enum DasarHarga {
    "Perolehan", 
    "Taksiran"
}

export enum MetodePenyusutan {
    "Straight Line",
    "Double Decline"
}

export interface IDaftarbarangAttributes {
    kode_barang? : number,
	kode_pembukuan? : string,
	kode_asset_nup? : number | null,
	nup : string | null,
	kode_asset : string,
	merk : string,
	tanggal_perolehan? : Date | undefined,
	kode_ruang : number,
	kd_ruang : number,
	deskripsi : string,
	nilai_item : number,
	kondisi : string,
	optional_key : string,
	qr_kode : string,
	alasan : string,
	umur_ekonomis : string,
	dasar_harga : DasarHarga,
	metode_penyusutan : MetodePenyusutan,
	ucr : string,
	uch : string,
	udcr? : Date | undefined,
	udch? : Date | undefined,
}

type DaftarBarangCreationAttributes = Optional<
IDaftarbarangAttributes,
"udcr"|
"udch"|
"kode_barang"|
"kode_asset_nup"|
"kode_pembukuan"|
"tanggal_perolehan"
>;

class DaftarBarang 
extends Model<IDaftarbarangAttributes,DaftarBarangCreationAttributes>
implements IDaftarbarangAttributes {
    declare kode_barang? : number;
	declare kode_pembukuan? : string;
	declare kode_asset_nup? : number | null;
	declare nup : string | null;
	declare kode_asset : string;
	declare merk : string;
	declare tanggal_perolehan? : Date | undefined;
	declare kode_ruang : number;
	declare kd_ruang : number;
	declare deskripsi : string;
	declare nilai_item : number;
	declare kondisi : string;
	declare optional_key : string;
	declare qr_kode : string;
	declare alasan : string;
	declare umur_ekonomis : string;
	declare dasar_harga : DasarHarga;
	declare metode_penyusutan : MetodePenyusutan;
	declare ucr : string;
	declare uch : string;
	declare udcr? : Date | undefined;
	declare udch? : Date | undefined;
}

DaftarBarang.init (
    {
        kode_barang : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true
        },
        kode_pembukuan : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
        kode_asset_nup : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        nup : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_asset : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        merk : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        tanggal_perolehan : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        kode_ruang : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        kd_ruang : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        deskripsi : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        nilai_item : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kondisi : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        optional_key : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        qr_kode : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        alasan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        umur_ekonomis : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        dasar_harga : {
            type : DataTypes.ENUM( "Perolehan", "Taksiran"),
            allowNull : true
        },
        metode_penyusutan : {
            type : DataTypes.ENUM("Straight Line", "Double Decline"),
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
        tableName : "ref_daftar_barang",
        modelName : "DaftarBarang",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

DaftarBarang.belongsTo(RefPembukuan, {
    foreignKey : "kode_pembukuan", 
    as : "refpembukuan"
});

RefPembukuan.hasMany(DaftarBarang, {
    foreignKey : "kode_pembukuan", 
    as : "daftarbarang"
});

DaftarBarang.belongsTo(RefRuang, {
    foreignKey : "kode_ruang", 
    as : "refruang"
})

RefRuang.hasMany(DaftarBarang, {
    foreignKey : "kode_ruang",
    as : "daftarbarang"
})

export default DaftarBarang