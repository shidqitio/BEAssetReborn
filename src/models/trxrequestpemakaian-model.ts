import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import AssetPersediaan from "./assetpersediaan-model";

export enum usulan  {
    option1 = 'usulan',
    option2 = 'diusulkan'
}

export interface ITrxRequestPemakaianAttributes {
    kode_pemakaian : number | null,
	tanggal_pemakaian :  Date | undefined,
	nip : string | null,
	kode_unit : string | null,
	nama_pengusul : string | null,
	kode_barang_persediaan : string | null,
	usulan : usulan | null,
	jumlah : number | null,
	jumlah_disetujui : number | null,
	keterangan : string | null,
	alasan : string | null,
	status : number | null,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class TrxRequestPemakaian 
extends Model<ITrxRequestPemakaianAttributes,Optional<ITrxRequestPemakaianAttributes, "kode_pemakaian"|"udcr"|"udch">>
implements ITrxRequestPemakaianAttributes {
    declare kode_pemakaian : number | null;
	declare tanggal_pemakaian :  Date | undefined;
	declare nip : string | null;
	declare kode_unit : string | null;
	declare nama_pengusul : string | null;
	declare kode_barang_persediaan : string | null;
	declare usulan : usulan | null;
	declare jumlah : number | null;
	declare jumlah_disetujui : number | null;
	declare keterangan : string | null;
	declare alasan : string | null;
	declare status : number | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

TrxRequestPemakaian.init(
    {
        kode_pemakaian : {
         type : DataTypes.INTEGER(),
         allowNull : false,
         primaryKey : true,
        },
        tanggal_pemakaian : {
         type : DataTypes.DATE(),
         allowNull : true   
        },
        nip : {
         type : DataTypes.STRING(),
         allowNull : true   
        },
        kode_unit : {
         type : DataTypes.STRING(),
         allowNull : true   
        },
        nama_pengusul : {
         type : DataTypes.STRING(),
         allowNull : true   
        },
        kode_barang_persediaan : {
         type : DataTypes.STRING(),
         allowNull : true   
        },
        usulan : {
         type : DataTypes.ENUM('usulan','diusulkan'),
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
        keterangan : {
         type : DataTypes.STRING(),
         allowNull : true   
        },
        alasan : {
         type : DataTypes.STRING(),
         allowNull : true   
        },
        status : {
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
        tableName : "trx_request_pemakaian",
        modelName : "TrxRequestPemakaian",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

export default TrxRequestPemakaian