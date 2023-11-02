import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import RefJenistrn from "./jenistrn-model";


export interface IPembukuanAttributes  {
    no_sppa : string,
	kode_pembukuan : string,
	jumlah_barang : number,
	asal_perolehan : string,
	no_bukti_perolehan : string,
	tanggal_perolehan? : Date | undefined,
	tanggal_pembukuan? : Date | undefined,
	keterangan : string,
	total_nilai : number,
	pdf : string,
	ucr : string,
	uch : string,
	udch? : Date | undefined,
	udcr? : Date | undefined,
}

class RefPembukuan 
extends Model<IPembukuanAttributes,Optional<IPembukuanAttributes,"udch" | "udcr">>
implements IPembukuanAttributes {
    declare no_sppa : string;
	declare kode_pembukuan : string;
	declare jumlah_barang : number;
	declare asal_perolehan : string;
	declare no_bukti_perolehan : string;
	declare tanggal_perolehan? : Date | undefined;
	declare tanggal_pembukuan? : Date | undefined;
	declare keterangan : string;
	declare total_nilai : number;
	declare pdf : string;
	declare ucr : string;
	declare uch : string;
	declare udch? : Date | undefined;
	declare udcr? : Date | undefined;
}

RefPembukuan.init (
    {
        no_sppa : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    kode_pembukuan : {
            type : DataTypes.STRING(),
            allowNull : false,
            primaryKey : true
        },
	    jumlah_barang : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
	    asal_perolehan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    no_bukti_perolehan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    tanggal_perolehan : {
            type : DataTypes.DATE(),
            allowNull : true
        },
	    tanggal_pembukuan : {
            type : DataTypes.DATE(),
            allowNull : true
        },
	    keterangan : {
            type : DataTypes.STRING(),
            allowNull : true
        },
	    total_nilai : {
            type : DataTypes.DECIMAL(),
            allowNull : true
        },
	    pdf : {
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
	    udch : {
            type : DataTypes.DATE(),
            allowNull : true
        },
	    udcr : {
            type : DataTypes.DATE(),
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

RefPembukuan.belongsTo(RefJenistrn, {
    foreignKey : "no_sppa",
    as : "refjenistn"
})

RefJenistrn.hasMany(RefPembukuan, {
    foreignKey : "no_sppa",
    as : "refpembukuan"
})

export default RefPembukuan