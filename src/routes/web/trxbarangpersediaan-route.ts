import express from 'express'
import trxbarangpersediaanController from '../../controllers/web/trxbarangpersediaan-controller'
import { uploadImage } from '../../middlewares/upload'
const routes = express.Router()

routes.get("/:id", trxbarangpersediaanController.getBarangPromise)

routes.get("/get-proses/:id", trxbarangpersediaanController.getBarangPromiseProses)

routes.get("/form", trxbarangpersediaanController.getForm);

routes.post("/post-barang-promise", trxbarangpersediaanController.storeDataPromise)

routes.post("/post-barang-upload", trxbarangpersediaanController.pembelianUpload)

routes.post("/cek-data/post-barang-upload", trxbarangpersediaanController.pembelianUpload2)

routes.post("/cek-data-part3/post-barang-upload", trxbarangpersediaanController.pembelianUpload3)

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

routes.delete("/hapus-excel/:kode", trxbarangpersediaanController.hapusBastByUnit)

routes.get("/baru/view-excel/detail/:kode_barang/:kode_unit", trxbarangpersediaanController.DetailBarangExist2)

//Proper  Flow 
routes.post("/store-promise/proper", trxbarangpersediaanController.storeDataPromiseNew);

routes.put("/update-kode-barang/proper/:kode_urut", trxbarangpersediaanController.ubahKodeBarang);

routes.put("/kirim-kasubag/proper", trxbarangpersediaanController.kirimKasubagNew);

routes.post("/store-paraf/proper", trxbarangpersediaanController.storeDataParafKasubag)

export default routes