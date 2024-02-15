import { DataTypes, Model, Optional } from "sequelize";
import TrxBarangPersediaanHeader from "./trxpersediaanheader-model";
import AssetPersediaan from "./assetpersediaan-model";
import TrxBastPersediaan from "./trxbast-model";
import db from "../config/database";


export enum pakai_unit {
   option1 ="Gudang",
   option2 ="Unit",
   option3 ="SiapPakai"
}

export enum status_pemakaian {
    option1 = "Penyimpanan",
    option2 = "TagBarang",
    option3 = "BarangTerpakai"
}

export interface ITrxBarangPersediaanDetail2Attributes {
    nomor_dokumen : string,
	id_permintaan : string | null,
	kode_pemakaian : number | null,
	kode_barang : string | null,
	kode_urut : number | null,
	kode_barang_persediaan : string | null,
	tahun : string | null,
	kode_unit : string | null,
	nama_barang : string | null,
	satuan : string | null,
	harga_satuan : number | null,
	keterangan : string | null,
	status_pemakaian : status_pemakaian | null,
	kode_gudang : number | null,
	pakai_unit : pakai_unit | null,
    kuantitas : number | null, 
	kuantitas_gerak : number | null
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxBarangPersediaanDetail2
extends Model<ITrxBarangPersediaanDetail2Attributes, Optional<ITrxBarangPersediaanDetail2Attributes, "kode_urut"| "udcr"|"udch">>
implements ITrxBarangPersediaanDetail2Attributes {
	declare nomor_dokumen : string;
	declare id_permintaan : string | null;
	declare kode_pemakaian : number | null;
	declare kode_barang : string | null;
	declare kode_urut : number | null;
	declare kode_barang_persediaan : string | null;
	declare tahun : string | null;
	declare kode_unit : string | null;
	declare nama_barang : string | null;
	declare satuan : string | null;
	declare harga_satuan : number | null;
	declare keterangan : string | null;
	declare status_pemakaian : status_pemakaian | null;
	declare kode_gudang : number | null;
	declare pakai_unit : pakai_unit | null;
    declare kuantitas : number | null;
	declare kuantitas_gerak : number | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

TrxBarangPersediaanDetail2.init(
	{
		nomor_dokumen : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		id_permintaan : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		kode_pemakaian : {
			type : DataTypes.INTEGER(),
			allowNull : true
		},
		kode_barang : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		kode_urut : {
			type : DataTypes.INTEGER(),
			allowNull : false,
			primaryKey : true
		},
		kode_barang_persediaan : {
			type : DataTypes.STRING(),
			allowNull : true,
			primaryKey : true
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
		nama_barang : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		satuan : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		harga_satuan : {
			type : DataTypes.DECIMAL(20,2),
			allowNull : true
		},
		keterangan : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		status_pemakaian : {
			type : DataTypes.ENUM('Penyimpanan','TagBarang','BarangTerpakai'),
			allowNull : true
		},
		kode_gudang : {
			type : DataTypes.STRING(),
			allowNull : true
		},
		pakai_unit : {
			type : DataTypes.ENUM('Gudang','Unit','SiapPakai'),
			allowNull : true
		},
        kuantitas : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
		kuantitas_gerak : {
            type : DataTypes.INTEGER(),
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
        tableName : "trx_barang_persediaan_detail_2",
        modelName : "TrxBarangPersediaanDetailBaru2",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
	}
)

TrxBarangPersediaanDetail2.belongsTo(TrxBastPersediaan, {
	foreignKey : "nomor_dokumen",
	as : "trxbastpersediaan"
})

TrxBastPersediaan.hasMany(TrxBarangPersediaanDetail2, {
	foreignKey : "nomor_dokumen",
	as : "trxpersediaandetail2"
})

TrxBarangPersediaanDetail2.belongsTo(AssetPersediaan, {
	foreignKey : "kode_barang_persediaan",
	as : "assetpersediaan"
})

AssetPersediaan.hasMany(TrxBarangPersediaanDetail2, {
	foreignKey : "kode_barang_persediaan",
	as : "trxpersediaandetail2"
})

export default TrxBarangPersediaanDetail2
