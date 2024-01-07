import { Request, Response, NextFunction } from "express";

export interface RefAssetBaru3Response {
    kode_asset_2 : string,
    kode_asset_3 : string,
    uraian_bidang : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetBaru4Response {
    kode_coa_4 : string,
    kode_asset_3 : string,
    kode_asset4 : string,
    uraian_kelompok : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetBaru5Response{
    kode_coa_5 : string,
    kode_asset_4 : string,
    kode_asset_5 : string,
    uraian_sub_kelompok : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetBaru6Response {
    kode_coa_6 : string,
    kode_asset_5 : string,
    kode_asset_6 : string,
    uraian_sub_sub_kelompok : string,
    udcr : Date | undefined,
    udch : Date | undefined,
}

export interface RefAssetBaru4Request {
    kode_coa_4 : string | null,
    kode_asset_3 : string | null,
    kode_asset_4 : string,
    uraian_kelompok : string | null
}

export interface RefAssetBaru5Request {
    kode_coa_5 : string | null,
    kode_asset_4 : string | null,
    kode_asset_5 : string,
    uraian_sub_kelompok : string | null
}

export interface RefAssetBaru6Request {
    kode_coa_6 : string | null,
    kode_asset_5 : string | null,
    kode_asset_6 : string,
    uraian_sub_sub_kelompok : string | null
}