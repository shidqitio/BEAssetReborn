import express from 'express'
const routes = express.Router()
import pembukuanController from '../../controllers/web/pembukuan-controller';

routes.get("/", pembukuanController.getPembukuan)
routes.get("/antrian-nup", pembukuanController.antrianNup)
routes.post("/", pembukuanController.storePembukuan);


export default routes