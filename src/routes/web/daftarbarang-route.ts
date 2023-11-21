import express from 'express'
const routes = express.Router()
import daftarbarangController from '../../controllers/web/daftarbarang-controller';

routes.get("/nup/:id", daftarbarangController.barangbyId)
routes.put("/nup/:id", daftarbarangController.updateNup);


export default routes