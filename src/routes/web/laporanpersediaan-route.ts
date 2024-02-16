import express from 'express'
const routes = express.Router()
import laporanPersediaan from '../../controllers/web/laporanpersediaan-controller';

// laporan header
routes.get("/:kode_unit", laporanPersediaan.getById)
routes.get("/", laporanPersediaan.getAll)

export default routes