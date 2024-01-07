import express from 'express'
import trxrequestpemakaianController from '../../controllers/web/trxrequestpemakaian-controller'
const routes = express.Router()


routes.put("/upload-excel", trxrequestpemakaianController.excelPemakaian)

routes.get("/pemakaian/:id", trxrequestpemakaianController.getRequestPemakaian)


export default routes