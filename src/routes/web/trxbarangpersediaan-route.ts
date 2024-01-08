import express from 'express'
import trxbarangpersediaanController from '../../controllers/web/trxbarangpersediaan-controller'
import { uploadImage } from '../../middlewares/upload'
const routes = express.Router()

routes.get("/:id", trxbarangpersediaanController.getBarangPromise)

routes.get("/get-proses/:id", trxbarangpersediaanController.getBarangPromiseProses)

routes.get("/form", trxbarangpersediaanController.getForm);

routes.post("/post-barang-promise", trxbarangpersediaanController.storeDataPromise)

routes.post("/post-barang-upload", trxbarangpersediaanController.pembelianUpload)

//gudang
routes.post("/post-barang-detail", trxbarangpersediaanController.detailBarang)

//Post Barang Unit 
routes.post("/post-barang-detail-unit", trxbarangpersediaanController.detailBarangUnit)

routes.delete("/hapus-barang-detail", trxbarangpersediaanController.deleteBarang)

routes.put("/kirim-kasubag", trxbarangpersediaanController.kirimKasubag)

//Kasubag 
routes.put("/tolak-kasubag", trxbarangpersediaanController.tolakKasubag)

routes.put("/paraf-kasubag", trxbarangpersediaanController.kasubagParaf)

//VIEW EXCEL
routes.get("/view-excel/:kode_unit", trxbarangpersediaanController.BastBarangPersediaanExist)

routes.get("/view-excel/detail/:kode_barang/:kode_unit", trxbarangpersediaanController.DetailBarangExist)

routes.put("/update-excel/detail", uploadImage.single("file"), trxbarangpersediaanController.uploadFileBast)

export default routes