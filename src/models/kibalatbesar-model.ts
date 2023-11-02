import { DataTypes, Model, Optional } from "sequelize";
import RefPembukuan from "./pembukuan-model";
import RefAsset from "./asset-model";
import db from "../config/database";

export interface IKibAlatBesarAttributes {
    kode_asset : string,
	no_asset : number,
	kode_pembukuan : string,
	no_kib_alatbesar : number,
	nup : string | null,
	kode_status_pemilik : string,
	tahun_pembuatan : string,
	merk : string,
	pabrik : string,
	perakitan : string,
	kapasitas : string,
	sistem_pendinginan : string,
	dudukan_peralatan : string,
	no_mesin : string,
	type : string,
	negara : string,
	sistem_operasi : string,
	sistem_pembakar : string,
	power_train : string,
	no_rangka : string,
	perlengkapan1 : string,
	perlengkapan2 : string,
	perlengkapan3 : string,
	kode_unit : string,
	nama_unit : string,
	sumber_dana : string,
	no_dana : string,
	tanggal_dana : string,
	harga_wajar : number,
	catatan : string,
	ucr : string | null
	uch : string | null,
	udcr? : Date | undefined,
	udch? : string | undefined,
}

class TrxAlatBesar 
extends Model<IKibAlatBesarAttributes,Optional<IKibAlatBesarAttributes,"udch" | "udcr" | "no_asset" | "no_kib_alatbesar">>
implements IKibAlatBesarAttributes {
    declare kode_asset : string;
	declare no_asset : number;
	declare kode_pembukuan : string;
	declare no_kib_alatbesar : number;
	declare nup : string | null;
	declare kode_status_pemilik : string;
	declare tahun_pembuatan : string;
	declare merk : string;
	declare pabrik : string;
	declare perakitan : string;
	declare kapasitas : string;
	declare sistem_pendinginan : string;
	declare dudukan_peralatan : string;
	declare no_mesin : string;
	declare type : string;
	declare negara : string;
	declare sistem_operasi : string;
	declare sistem_pembakar : string;
	declare power_train : string;
	declare no_rangka : string;
	declare perlengkapan1 : string;
	declare perlengkapan2 : string;
	declare perlengkapan3 : string;
	declare kode_unit : string;
	declare nama_unit : string;
	declare sumber_dana : string;
	declare no_dana : string;
	declare tanggal_dana : string;
	declare harga_wajar : number;
	declare catatan : string;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr? : Date | undefined;
	declare udch? : string | undefined;
}

TrxAlatBesar.init(
    {
        kode_asset : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_asset : {
            type : DataTypes.INTEGER(),
            allowNull : false, 
            primaryKey : true
        },
        kode_pembukuan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_kib_alatbesar : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        nup : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_status_pemilik : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        tahun_pembuatan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        merk : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        pabrik : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        perakitan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kapasitas : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        sistem_pendinginan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        dudukan_peralatan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_mesin : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        type : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        negara : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        sistem_operasi : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        sistem_pembakar : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        power_train : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_rangka : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        perlengkapan1 : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        perlengkapan2 : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        perlengkapan3 : {
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
            type : DataTypes.STRING(),
            allowNull : true
        },
        harga_wajar : {
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
            type : DataTypes.STRING(),
            allowNull : true
        },
        udch : {
            type : DataTypes.STRING(),
            allowNull : true
        },
    },
    {
        sequelize : db,
        tableName : "ref_pembukuan",
        modelName : "RefPembukuan",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxAlatBesar.belongsTo(RefPembukuan, {
    foreignKey : "kode_pembukuan",
    as : "refpembukuan"
})

RefPembukuan.hasMany(TrxAlatBesar,{
    foreignKey : "kode_pembukuan",
    as : "trxalatbesar"
})

TrxAlatBesar.belongsTo(RefAsset, {
    foreignKey : "kode_asset",
    as : "refasset"
})

RefAsset.hasMany(TrxAlatBesar,{
    foreignKey : "kode_asset", 
    as : "trxalatbesar"
})

export default TrxAlatBesar