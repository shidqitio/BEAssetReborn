import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import RefPembukuan from "./pembukuan-model";
import RefAsset from "./asset-model";

export enum SumberDana {
    "APBN",
    "NON APBN"
}

export interface IKibAngkutanAttributes {
    kode_status_pemilik : string,
	kode_asset : string,
	kode_pembukuan : string,
	no_asset : number,
	no_kib_angkutan : number,
	nup : string,
	tahun_pembuatan : string,
	type : string,
	pabrik : string,
	negara : string,
	perakitan : string,
	daya_muat : string,
	bobot : string,
	daya_mesin : string,
	mesin_penggerak : string,
	jumlah_mesin : number,
	bahan_bakar : string,
	no_mesin : string,
	no_rangka : string,
	no_bpkb : string,
	no_polisi : string,
	perlengkapan1 : string,
	perlengkapan2 : string,
	perlengkapan3 : string,
	kode_unit : string,
	nama_unit : string,
	sumber_dana : SumberDana,
	no_dana : string,
	tanggal_dana : Date | undefined,
	harga_wajar : number,
	catatan : string,
	uch : string | null,
	ucr : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}

class KibAngkutan 
extends Model<IKibAngkutanAttributes,Optional<IKibAngkutanAttributes,"udch"|"udcr"|"no_asset"|"no_kib_angkutan">>
implements IKibAngkutanAttributes {
        declare kode_status_pemilik : string;
        declare kode_asset : string;
        declare kode_pembukuan : string;
        declare no_asset : number;
        declare no_kib_angkutan : number;
        declare nup : string;
        declare tahun_pembuatan : string;
        declare type : string;
        declare pabrik : string;
        declare negara : string;
        declare perakitan : string;
        declare daya_muat : string;
        declare bobot : string;
        declare daya_mesin : string;
        declare mesin_penggerak : string;
        declare jumlah_mesin : number;
        declare bahan_bakar : string;
        declare no_mesin : string;
        declare no_rangka : string;
        declare no_bpkb : string;
        declare no_polisi : string;
        declare perlengkapan1 : string;
        declare perlengkapan2 : string;
        declare perlengkapan3 : string;
        declare kode_unit : string;
        declare nama_unit : string;
        declare sumber_dana : SumberDana;
        declare no_dana : string;
        declare tanggal_dana : Date | undefined;
        declare harga_wajar : number;
        declare catatan : string;
        declare uch : string | null;
        declare ucr : string | null;
        declare udcr : Date | undefined;
        declare udch : Date | undefined;
}

KibAngkutan.init(
    {
        kode_status_pemilik : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_asset : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_pembukuan : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
        no_asset : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true
        },
        no_kib_angkutan : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        nup : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        tahun_pembuatan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        type : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        pabrik : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        negara : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        perakitan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        daya_muat : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        bobot : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        daya_mesin : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        mesin_penggerak : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        jumlah_mesin : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        bahan_bakar : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_mesin : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_rangka : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_bpkb : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        no_polisi : {
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
            type : DataTypes.ENUM("APBN","NON APBN"),
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
        harga_wajar : {
            type : DataTypes.DECIMAL(20,2),
            allowNull : true
        },
        catatan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        uch : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        ucr : {
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
        tableName : "trx_kib_angkutan",
        modelName : "KibAngkutan",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

KibAngkutan.belongsTo(RefAsset, {
    foreignKey : "kode_asset",
    as : "refasset"
})

RefAsset.hasMany(KibAngkutan, {
    foreignKey : "kode_asset", 
    as : "kibangkutan"
})

KibAngkutan.belongsTo(RefPembukuan, {
    foreignKey : "kode_pembukuan",
    as : "refpembukuan"
})

RefPembukuan.hasMany(KibAngkutan,{
    foreignKey : "kode_pembukuan",
    as : "kibangkutan"
})

export default KibAngkutan