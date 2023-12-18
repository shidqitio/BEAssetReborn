import express from 'express'
const routes = express.Router()
import reklasifikasiController from '../../controllers/web/reklasifikasi-controller';


routes.get("/", reklasifikasiController.getReklasifikasi)
routes.post("/", reklasifikasiController.storeReklasifikasi);
routes.delete("/:trx_barang_persediaan", reklasifikasiController.deleteReklasifikasi);
routes.patch("/:trx_barang_persediaan", reklasifikasiController.updateReklasifikasi);


export default routes