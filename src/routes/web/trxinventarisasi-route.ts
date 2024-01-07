import express from 'express'
const routes = express.Router()
import trxinventarisasiController from "../../controllers/web/trxinventarisasi-controller"
import { uploadImage } from '../../middlewares/upload'

routes.get("/:id", trxinventarisasiController.viewInventarisasiBarang)

routes.get("/detail/:nup", trxinventarisasiController.detailBarangInventarisasi)


routes.put("/ditemukan/:nup", trxinventarisasiController.BarangDitemukan)
routes.put("/tidak-ditemukan/:nup", trxinventarisasiController.BarangTidakDitemukan)
routes.put("/batal-ditemukan/:nup", trxinventarisasiController.BatalDitemukan)

routes.post("/post-barang-inventarisasi", 
uploadImage.single("file"),
trxinventarisasiController.TambahInventarisasi)


export default routes