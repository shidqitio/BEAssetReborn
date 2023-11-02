import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express, {Application} from "express"
import helmet from "helmet";
import http from "http";
import dotenv from "dotenv"
import log4js from "log4js";
import db from "./config/database";
import logger, {errorLogger} from "./config/logger";
import {notFound} from "./middlewares/not-found";
import { errorhandler } from "./middlewares/error-handler";
import webRoutes from "../src/routes/web/index"


const app : Application = express()
const server = http.createServer(app)
log4js.configure(logger)

dotenv.config()

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(helmet());
app.use(cors());
app.use(compression());


//=====================================================
//ROUTES
app.use("/web", webRoutes)

//Not Found
app.use(notFound)

//Error Handler
app.use(errorhandler)


db.sync()
.then(() => {
    server.listen(process.env.PORT_SERVER,() => {
        console.log(`app running on port ${process.env.PORT_SERVER}`);
    })
})
.catch((error) => {
    errorLogger.error("SERVER ERROR", error)
  });