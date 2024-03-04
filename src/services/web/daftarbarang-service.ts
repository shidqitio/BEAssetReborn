import DaftarBarang, { Kondisi } from "../../models/daftarbarang-model";
import RefPembukuan from "../../models/pembukuan-model";
import RefAsset from "../../models/asset-model";
import { DaftarBarangRequest, DaftarBarangUpdate } from "../../controllers/web/daftarbarang-controller";
import { Op, QueryTypes } from "sequelize";
import db from "../../config/database";
import RefRuang from "../../models/ruang-model";
import qrcode from "qrcode";
import TrxPenyusutan from "../../models/trx_penyusutan-model";
import dotenv from "dotenv"
import sequelize from "sequelize";
dotenv.config()
import path from "path"
import moment from 'moment';


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
                attributes : ["kode_barang", "kode_asset", "tanggal_perolehan", "nilai_item", "umur_ekonomis",
                              "metode_penyusutan"],
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
        
            for (let i = 0; i < findbarang.length; i++) {
              //Ambil Kode Unit
              let kode_unit : string = findbarang[i].refruang.kode_unit
              //Ambil Tahun
              let tanggal_split = findbarang[i].tanggal_perolehan.split('-')
              //Ambil Kode Asset
              let kode_asset = findbarang[i].kode_asset
              // Increment no_urut by 1
              no_urut++; 
              //Ambil Tanggal Untuk Penyusutuan 
              let tanggal_oleh = findbarang[i].tanggal_perolehan
              //Ambil Nilai Item 
              let nilai : number = findbarang[i].nilai_item
              //Ambil Umur Ekonomis
              let umur : number = findbarang[i].umur_ekonomis
              //Metode Penyusutan 
              let metode_penyusutan = findbarang[i].metode_penyusutan
              //Pengurang 
              let pengurang : number = Math.round(nilai / umur)
              let array_data : any = []

              
              //================================ Buat NUP ==============================
              let nup : string = kode_unit + "." + tanggal_split[0] + "." + kode_asset + "." + no_urut
              console.log(nup)
              
              const simpan_file : string = `${process.env.HOST_ASSET}/public/qrcode/${nup}.png`

              let save_qr = `${process.env.HOST_ASSET}/detail/${nup}`

              const filename = path.join('.','src', 'public','images','qrcode',`${nup}.png`)

              qrcode.toFile(filename, save_qr)
              //================================================================================

              //============================HITUNG PENYUSUTAN ===========================

              if(metode_penyusutan === "Straight Line") {
                let j : number
                for(j = 1 ; j <= umur ; j++) {
                  let kali : number = pengurang * j
                  let akhir : number = nilai - kali
                  let timestamp = tanggal_oleh 
                  let date = new Date(timestamp)
                  let tes =+ j
                  date.setFullYear(date.getFullYear()+ j )
                  console.log("TES STRAIGHT LINE : ",tes, nup, akhir,date.toISOString())
                  array_data.push({
                    nup               : nup,
                    beban_penyusutan : pengurang, 
                    nilai_susut       : kali,
                    nilai_item        : nilai,
                    tanggal_penyusutan: date.toISOString().substr(0, 10),
                    angka_penyusutan  : akhir,
                    penyusutan_ke     : tes,
                    penyusutan : "Straight Line"
                  })
                }
              }

              else {
                //Untuk Dapat Pengurang jika array kosong 
                let kurang = pengurang * 2 
                let hasil_dd = nilai - kurang
                let timestamp = tanggal_oleh 
                let date = new Date(timestamp)
                // let tes =+ j 
                date.setFullYear(date.getFullYear())
                console.log(nup, date.toISOString())
                array_data.push({
                  nup               : nup,
                  nilai_item        : nilai,
                  nilai_susut       : 0,
                  tanggal_penyusutan: date.toISOString().substr(0, 10),
                  angka_penyusutan  : nilai,
                  penyusutan_ke     : 0,
                  penyusutan : "Double Decline"
                }) 
                for(let j = 0 ; j < umur ; j++) {
                  // console.log(array_data)
                      let item_nilai : number = array_data[j].angka_penyusutan
                      kurang = item_nilai / umur  * 2
                      hasil_dd = item_nilai - kurang
                          let timestamp = tanggal_oleh
                          let date      = new Date(timestamp)
                          let tes       = j + 1
                          date.setFullYear(date.getFullYear()+ (j + 1) )
                          array_data.push({
                              nup : nup,
                              nilai_susut       : kurang,
                              nilai_item        : nilai,
                              tanggal_penyusutan: date.toISOString().substr(0, 10),
                              angka_penyusutan  : hasil_dd,
                              penyusutan_ke     : tes,
                              penyusutan : "Double Decline"
                          })       
                  } 
              }

                await TrxPenyusutan.bulkCreate(array_data, {transaction : t})
              //==================================================================================

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

const barangbyId =async (
  kode:string) : Promise<[any | null, any | null]> => {
  try {
    let currentYear = moment().year()
      const barang:RefPembukuan | null = await RefPembukuan.findOne({
        attributes : {exclude : ["ucr", "uch", "udcr", "udch"]},
        include : [
          {
            model : DaftarBarang,
            as : 'daftarbarang',
            attributes :  {exclude : ["ucr", "uch", "udcr", "udch"]},
            where : {
              nup : kode
            },
            include  : [
              {
                model : RefRuang,
                as : 'refruang',
                attributes : {exclude : ['udcr','udch','ucr','uch', 'nama_pj','nip']}
              },
              {
                model : TrxPenyusutan,
                as : "trxpenyusutan",
                attributes : {exclude : ['ucr','uch','udcr','udch']},
                on : {
                  nup : sequelize.where(sequelize.col(`daftarbarang.nup`),`=`, sequelize.col('daftarbarang.trxpenyusutan.nup'))
                },
                required : false
              }
            ]
          }
        ]
      })
      if (!barang) {
        return [null, {code : 409, message : "Data Tidak Ada"}]
      }

      return [barang, null]
  } catch (error : any) {
      return [null, {code : 500, message : error.message}]
  }
}

const ubahKondisiBarang =async (
  kode:string, request:DaftarBarangRequest) : Promise<[any | null, any | null]> => {
    try {
        const exDaftarBarang : DaftarBarang | null = await DaftarBarang.findOne({
          where : {
            nup : kode
          }
        })

        if(!exDaftarBarang) {
          return [null, {code : 409, message : "Data Tidak Ada"}]
        }

        // const updateDaftarBarang : any = await DaftarBarang.update({
        //   kondisi : request.kondisi,
        //   alasan : request.alasan
        // }, {
        //   where : {
        //     nup : kode
        //   }
        // })

        const kondisiEnum: Kondisi = Kondisi[request.kondisi as keyof typeof Kondisi];

        exDaftarBarang.kondisi = kondisiEnum
        exDaftarBarang.alasan = request.alasan

       
        await exDaftarBarang.save()

        return [exDaftarBarang, null]

    } catch (error : any) {
        return [null, {code : 500, message : error.message}]
    }
}


const pindahRuang =async (
  kode:string, request : DaftarBarangRequest)  : Promise<[any | null, any | null]>  => {
   try {
    const exDaftarBarang : DaftarBarang | null = await DaftarBarang.findOne({
      where : {
        nup : kode
      }
    })

    if(!exDaftarBarang) {
      return [null, {code : 409, message : "Data Tidak Ada"}]
    }

    const updateDaftarBarang : any = await DaftarBarang.update({
      kd_ruang : request.kd_ruang,
      kode_ruang : request.kode_ruang
    }, {
      where : {
        nup : kode
      }
    })

    if(!updateDaftarBarang) {
      return [null, {code : 409, message : "Data Gagal Update"}]
    }

    return [exDaftarBarang, null]

   } catch (error : any) {
    return [null, {code : 500, message : error.message}]
   }
}

const detailBarangbyRuang =async (
  kode:number, kode_unit: string, status :number, page : number, limit : number) : Promise<[any | null, any | null]> => {
  try {

      let offset = 0 ;

      if(page > 1 ) {
          offset = (page - 1) * limit ;
      }

      const barang : DaftarBarang[] = await DaftarBarang.findAll({
        where : {
          status_barang : status,
          kode_asset_nup : {
            [Op.not] : null
          }
        },
        attributes : {exclude : ["ucr", "uch", "udcr", "udch"]},
        include : [
          {
            model : RefRuang, 
            as : "refruang",
            attributes : {exclude : ['ucr','uch','udcr','udch']},
            where : {
              kode_ruang : kode,
              kode_unit : kode_unit
            },
            required : true
          },
        ],
        limit : limit,
        offset : offset
      })

      if(!barang) {
        return [null, {code : 499, message : "Daftar Barang Tidak Ada"}]
      }

      return [barang, null]
     
  } catch (error : any) {
      return [null, {code : 500, message : error.message}]
  }
}

const detailByBarang =async (
  kode:string, kode_unit: string, page : number, limit : number) : Promise<[any | null, any | null]> => {
  try {

      let offset = 0 ;

      if(page > 1 ) {
          offset = (page - 1) * limit ;
      }

      const barang : DaftarBarang[] = await DaftarBarang.findAll({
        where : {
          kode_asset : kode,
          kode_asset_nup : {
            [Op.not] : null
          }
        },
        attributes : {exclude : ["ucr", "uch", "udcr", "udch"]},
        include : [
          {
            model : RefRuang, 
            as : "refruang",
            attributes : {exclude : ['ucr','uch','udcr','udch']},
            where : {
              kode_unit : kode_unit
            },
            required : true
          },
        ],
        limit : limit,
        offset : offset
      })

      if(!barang) {
        return [null, {code : 499, message : "Daftar Barang Tidak Ada"}]
      }

      return [barang, null]
     
  } catch (error : any) {
      return [null, {code : 500, message : error.message}]
  }
}

const hitungKode4 =async () : Promise<[any | null, any | null]>  => {
  try {
      const SumAsset : DaftarBarang[] = 
        await db.query(`SELECT COALESCE(SUM(nilai_item), 0), a.kode_asset_4 FROM 
        ref_asset_baru_4 a 
        left JOIN ref_asset_baru_5 b ON a.kode_asset_4 = b.kode_asset_4
        left JOIN ref_asset_baru_6 c ON b.kode_asset_5 = c.kode_asset_5
        left JOIN ref_asset d ON c.kode_asset_6 = d.kode_asset_6
        left JOIN ref_daftar_barang e ON d.kode_asset = e.kode_asset
        GROUP BY a.kode_asset_4`,
        {
          type : QueryTypes.SELECT
        }
        )

        if(SumAsset.length === 0 ){
          return [null, {code : 499, message : "Data Tidak Ada"}]
      }
      

      return [SumAsset[0], null]
  } catch (error : any) {
    return [null, {code : 500, message : error.message}]
  }
}

export default {
    updateNup,
    barangbyId,
    ubahKondisiBarang,
    pindahRuang,
    detailBarangbyRuang,
    detailByBarang,
    hitungKode4
}