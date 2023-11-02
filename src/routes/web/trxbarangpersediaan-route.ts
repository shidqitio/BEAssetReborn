import express from 'express'
import trxbarangpersediaanController from '../../controllers/web/trxbarangpersediaan-controller'
const routes = express.Router()

routes.get("/:id", trxbarangpersediaanController.getBarangPromise)

routes.get("/get-proses/:id", trxbarangpersediaanController.getBarangPromiseProses)

routes.get("/form", trxbarangpersediaanController.getForm);

routes.post("/post-barang-promise", trxbarangpersediaanController.storeDataPromise)

//gudang
routes.post("/post-barang-detail", trxbarangpersediaanController.detailBarang)

//Post Barang Unit 
routes.post("/post-barang-detail-unit", trxbarangpersediaanController.detailBarangUnit)

routes.delete("/hapus-barang-detail", trxbarangpersediaanController.deleteBarang)

routes.put("/kirim-kasubag", trxbarangpersediaanController.kirimKasubag)

//Kasubag 
routes.put("/tolak-kasubag", trxbarangpersediaanController.tolakKasubag)

routes.put("/paraf-kasubag", trxbarangpersediaanController.kasubagParaf)

export default routes