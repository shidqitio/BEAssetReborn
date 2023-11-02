import express from 'express'
const routes = express.Router()
import ruangController from '../../controllers/web/ruang-controller'

routes.get("/", ruangController.getRuangAll)

routes.get("/unit/:id",ruangController.getRuangByUnit)

routes.post("/",ruangController.storeRuang)

routes.put("/update-ruang/:id", ruangController.updateRuang)

routes.delete("/hapus-ruang/:id", ruangController.deleteRuang)

export default routes