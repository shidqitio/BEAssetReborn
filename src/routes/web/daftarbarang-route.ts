import express from 'express'
const routes = express.Router()
import daftarbarangController from '../../controllers/web/daftarbarang-controller';

routes.get("/nup/:id", daftarbarangController.barangbyId)
routes.get("/daftar-barang/ruang/:id1/:kode_unit/:id2", daftarbarangController.detailBarangbyRuang)
routes.put("/nup/:id", daftarbarangController.updateNup);
routes.put("/ubah-kondisi/:id", daftarbarangController.ubahKondisiBarang)


export default routes