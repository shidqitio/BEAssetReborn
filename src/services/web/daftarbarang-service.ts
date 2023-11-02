import DaftarBarang from "../../models/daftarbarang-model";
import RefPembukuan from "../../models/pembukuan-model";
import RefAsset from "../../models/asset-model";
import { DaftarBarangRequest, DaftarBarangUpdate } from "../../controllers/web/daftarbarang-controller";
import { Op } from "sequelize";
import db from "../../config/database";
import RefRuang from "../../models/ruang-model";
import qrcode from "qrcode";
import dotenv from "dotenv"
dotenv.config()
import path from "path"

const updateNup =async (
    kode_pembukuan:string,
    )   : Promise<[any | null, any | null]> => {
    const t = await db.transaction()
    try {

        const daftarbarang : DaftarBarang[]  = await DaftarBarang.findAll({
            attributes : ["kode_asset"],
            where : {
                kode_pembukuan : kode_pembukuan,
                kode_asset_nup : {
                  [Op.is] : null
                }
            },
            group : ["kode_asset"],
            raw : true
        })

       if(daftarbarang.length === 0) {
        return [null, {code : 409, message : "Barang Sudah Diberi NUP"}]
       }


        const mapItem : any = daftarbarang.map(async(item : DaftarBarang) => {
            let barang1 : any = await DaftarBarang.findAll({
                attributes : ["kode_asset_nup", "kode_asset"],
                where : {
                    kode_asset : item.kode_asset
                },
                order : [
                    ["kode_asset_nup", "DESC"]
                ],
                limit : 1,
                raw : true,
                transaction : t
            })

            let findbarang : any = await DaftarBarang.findAll({
                attributes : ["kode_barang", "kode_asset", "tanggal_perolehan"],
                where : {
                    kode_pembukuan : kode_pembukuan,
                    kode_asset : item.kode_asset,
                    kode_asset_nup : {
                      [Op.is] : null
                    }
                },
                include : [
                  {
                    model : RefRuang,
                    as : "refruang", 
                    attributes : ["kode_ruang","kode_unit"]
                  }
                ],
                raw : true, 
                nest : true,
                transaction : t, 
            })


            let no_urut: number = barang1[0].kode_asset_nup;
            
            // console.log("TES FINDBARANG : ", findbarang)

          // console.log(findbarang[0].refruang.kode_unit)
        
            for (let i = 0; i < findbarang.length; i++) {
              //Ambil Kode Unit
              let kode_unit : string = findbarang[i].refruang.kode_unit
              //Ambil Tahun
              let tanggal_split = findbarang[i].tanggal_perolehan.split('-')
              //Ambil Kode Asset
              let kode_asset = findbarang[i].kode_asset

              no_urut++; // Increment no_urut by 1
              
              //Buat NUP 
              let nup : string = kode_unit + "." + tanggal_split[0] + "." + kode_asset + "." + no_urut
              console.log(nup)
              
              const simpan_file : string = `${process.env.HOST_ASSET}/public/qrcode/${nup}.png`

              let save_qr = `${process.env.HOST_ASSET}/detail/${nup}`

              const filename = path.join('.','src', 'public','images','qrcode',`${nup}.png`)

              qrcode.toFile(filename, save_qr)

                await DaftarBarang.update(
                  {
                    kode_asset_nup: no_urut,
                    nup : nup,
                    qr_kode : simpan_file
                  },
                  {
                    where: {
                      kode_pembukuan: kode_pembukuan,
                      kode_barang: findbarang[i].kode_barang,
                      kode_asset: findbarang[i].kode_asset,
                
                    },
                    transaction : t
                  }
                );
              }
            });
            
        await Promise.all(mapItem)
          // .then(() => {
          //   console.log("Semua proses selesai");
          //   t.commit()
          // })
        await t.commit()
        return [daftarbarang, null]
    } catch (error : any) {
        await t.rollback()
        return [null, {code : 500, message : error.message}]
    }
}

export default {
    updateNup
}