import { DataTypes, Model, Optional } from "sequelize";
import TrxBarangPersediaanHeader from "./trxpersediaanheader-model";
import AssetPersediaan from "./assetpersediaan-model";
import TrxBastPersediaan from "./trxbast-model";
import db from "../config/database";


// export enum pakai_unit {
//    option1 ="Gudang",
//    option2 ="Unit",
//    option3 ="SiapPakai"
// }

// export enum status_pemakaian {
//     option1 = "Penyimpanan",
//     option2 = "TagBarang",
//     option3 = "BarangTerpakai"
// }

export interface ITrxBarangPenampungAttributes {
    nomor_dokumen : string,
	kode_barang : string | null,
	kode_urut : number,
	kode_barang_persediaan : string | null,
	tahun : string | null,
	kode_unit : string | null,
	harga_satuan : number | null,
    kuantitas : number | null, 
	harga_total : number | null,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxBarangPenampung
extends Model<ITrxBarangPenampungAttributes, Optional<ITrxBarangPenampungAttributes, |"kode_urut"| "harga_total"|"udcr"|"udch">>
implements ITrxBarangPenampungAttributes {
	declare nomor_dokumen : string;
	declare kode_barang : string | null;
	declare kode_urut : number;
	declare kode_barang_persediaan : string | null;
	declare tahun : string | null;
	declare kode_unit : string | null;
	declare harga_satuan : number | null;
    declare kuantitas : number | null;
	declare harga_total : number | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

TrxBarangPenampung.init(
	{
		nomor_dokumen : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		kode_barang : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		kode_urut : {
			type : DataTypes.INTEGER(),
			autoIncrement : true,
			allowNull : false,
			primaryKey : true,
		},
		kode_barang_persediaan : {
			type : DataTypes.STRING(),
			allowNull : true,
			primaryKey : false
		},
		tahun : {
			type : DataTypes.STRING(),
			allowNull : true,
			primaryKey : true
		},
		kode_unit : {
			type : DataTypes.STRING(),
			allowNull : true,
			primaryKey : true
		},
		harga_satuan : {
			type : DataTypes.DECIMAL(20,2),
			allowNull : true
		},
        kuantitas : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
		harga_total : {
			type : DataTypes.DECIMAL(16,2),
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
        tableName : "trx_barang_penampung",
        modelName : "TrxBarangPenampung",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
	}
)

TrxBarangPenampung.belongsTo(TrxBastPersediaan, {
	foreignKey : "nomor_dokumen",
	as : "trxbastpersediaan"
})

TrxBastPersediaan.hasMany(TrxBarangPenampung, {
	foreignKey : "nomor_dokumen",
	as : "trxbarangpenampung"
})

TrxBarangPenampung.belongsTo(AssetPersediaan, {
	foreignKey : "kode_barang_persediaan",
	as : "assetpersediaan"
})

AssetPersediaan.hasMany(TrxBarangPenampung, {
	foreignKey : "kode_barang_persediaan",
	as : "trxbarangpenampung"
})

export default TrxBarangPenampung
