import express from 'express'
const routes = express.Router()
import daftarbarangController from '../../controllers/web/daftarbarang-controller';

routes.get("/nup/:id", daftarbarangController.barangbyId)
routes.get("/daftar-barang/ruang/:id1/:kode_unit/:id2", daftarbarangController.detailBarangbyRuang)
routes.get("/daftar-barang/barang/:id1/:kode_unit",daftarbarangController.detailByBarang)
routes.put("/nup/:id", daftarbarangController.updateNup);
routes.put("/ubah-kondisi/:id", daftarbarangController.ubahKondisiBarang)

routes.get("/daftar-barang/hitung-coa", daftarbarangController.hitungKode4)




export default routes