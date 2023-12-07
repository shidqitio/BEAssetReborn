import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import DaftarBarang from "./daftarbarang-model";

export interface ITrxPenyusutan {
    kode_penyusutan : number,
    nup : string,
	nilai_item : number | null,
	tanggal_penyusutan : Date | null,
	nilai_susut : number | null,
	angka_penyusutan : number | null,
	penyusutan_ke : number | null,
    penyusutan : string | null,
	ucr : string | null,
	uch : string | null,
	udcr : Date | undefined,
	udch : Date | undefined,
}


class TrxPenyusutan 
extends Model<ITrxPenyusutan,Optional<ITrxPenyusutan, 
"kode_penyusutan" | 
"nup" |
"nilai_item" |
"tanggal_penyusutan" |
"angka_penyusutan" |
"penyusutan_ke" |
"penyusutan" |
"ucr" |
"uch" | 
"udch" | 
"udcr">>
implements ITrxPenyusutan {
    declare kode_penyusutan : number;
    declare nup : string;
	declare nilai_item : number | null;
	declare tanggal_penyusutan : Date | null;
	declare nilai_susut : number | null;
	declare angka_penyusutan : number | null;
	declare penyusutan_ke : number | null;
    declare penyusutan : string | null;
	declare ucr : string | null;
	declare uch : string | null;
	declare udcr : Date | undefined;
	declare udch : Date | undefined;
}

TrxPenyusutan.init(
    {
        nup : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        kode_penyusutan : {
            type : DataTypes.STRING(),
            allowNull : false, 
            primaryKey : true,
            autoIncrement : true
        },
	    nilai_item : {
            type : DataTypes.DECIMAL(),
            allowNull : true
        },
	    tanggal_penyusutan : {
            type : DataTypes.DATE(),
            allowNull : true
        },
	    nilai_susut : {
            type : DataTypes.DECIMAL(),
            allowNull : true
        },
	    angka_penyusutan : {
            type : DataTypes.DECIMAL(),
            allowNull : true
        },
	    penyusutan_ke : {
            type : DataTypes.INTEGER(),
            allowNull : true
        },
        penyusutan : {
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
        tableName : "trx_perhitungan_penyusutan",
        modelName : "TrxPerhitunganPenyusutan",
        underscored : true,
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxPenyusutan.belongsTo(DaftarBarang, {
    foreignKey : "nup",
    as : "daftarbarang"
})

DaftarBarang.hasMany(TrxPenyusutan, {
    foreignKey : 'nup',
    as : 'trxpenyusutan'
})

export default TrxPenyusutan