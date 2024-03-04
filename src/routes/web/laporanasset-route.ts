import express from 'express'
const routes = express.Router()
import laporanassetController from '../../controllers/web/laporanasset-controller';


routes.get("/", laporanassetController.LaporanAsset)



export default routes