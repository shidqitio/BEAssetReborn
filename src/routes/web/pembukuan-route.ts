import express from 'express'
const routes = express.Router()
import pembukuanController from '../../controllers/web/pembukuan-controller';

import schema from '../../schema/web/pembukuan-schema'

import validate from '../../schema/validate';

routes.get("/", pembukuanController.getPembukuan)
routes.get("/antrian-nup", pembukuanController.antrianNup)
routes.get("/antrian-nup/detail/:id", schema.antriannupdetailSchema,validate,pembukuanController.antrianNupDetail)

routes.post("/", schema.storePembukuanSchemas,validate, pembukuanController.storePembukuan);


export default routes