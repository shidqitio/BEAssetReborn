import express from 'express'
const routes = express.Router()
import laporanassetController from '../../controllers/web/laporanasset-controller';


routes.post("/", laporanassetController.LaporanAsset)

routes.post("/laporan-level5", laporanassetController.LaporatAssetlvl5)

routes.post("/laporan-level6", laporanassetController.LaporanAssetLevel6)



export default routes