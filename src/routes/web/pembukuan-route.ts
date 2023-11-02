import express from 'express'
const routes = express.Router()
import pembukuanController from '../../controllers/web/pembukuan-controller';

routes.post("/", pembukuanController.storePembukuan);


export default routes