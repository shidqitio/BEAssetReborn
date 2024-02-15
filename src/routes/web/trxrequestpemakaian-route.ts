import express from 'express'
import trxrequestpemakaianController from '../../controllers/web/trxrequestpemakaian-controller'
const routes = express.Router()


routes.put("/upload-excel", trxrequestpemakaianController.excelPemakaian)


routes.put("/upload-excel/baru", trxrequestpemakaianController.excelPemakaian3)

routes.get("/pemakaian/:id", trxrequestpemakaianController.getRequestPemakaian)

routes.get("/pemakaian2/:id", trxrequestpemakaianController.getRequestPemakaian2)

routes.put("/baru/upload-excel", trxrequestpemakaianController.excelPemakaian2)

routes.delete("/hapus-pemakaian/:kode", trxrequestpemakaianController.hapusPemakaian)

routes.delete("/hapus-pemakaian/new/:kode_unit", trxrequestpemakaianController.hapusPemakaian2)


export default routes