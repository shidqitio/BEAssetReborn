import express from 'express'
const routes = express.Router()
import assetController from '../../controllers/web/asset-controller'

routes.get("/", assetController.getRefAsset);

routes.get("/bykode/:id", assetController.getAssetById)

routes.get("/bynama/:id", assetController.getAssetByNama)

export default routes