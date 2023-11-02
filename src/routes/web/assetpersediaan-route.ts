import express from 'express'
const routes = express.Router()
import assetpersediaanController from '../../controllers/web/assetpersediaan-controller'

routes.get("/", assetpersediaanController.getAll)
routes.get("/getById/:id", assetpersediaanController.getById)
routes.post("/", assetpersediaanController.createAsset)
routes.put("/:id", assetpersediaanController.updateAsset)
routes.delete("/:id", assetpersediaanController.hapusAssetPersediaan)


export default routes