import express from "express";
const routes = express.Router();
//ASSET
import assetRoutes from "./asset-route"
import pembukuanRoutes from "./pembukuan-route"
import daftarbarangRoutes from "./daftarbarang-route"
import ruangRoutes from "./ruang-route"

//PERSEDIAAN
import assetpersediaanRoutes from "./assetpersediaan-route"
import trxbarangpersediaanRoutes from "./trxbarangpersediaan-route"

//ROUTING
routes.use("/asset",assetRoutes)

routes.use("/pembukuan",pembukuanRoutes)

routes.use("/barang", daftarbarangRoutes)

routes.use("/ruang", ruangRoutes)

routes.use("/asset-persediaan", assetpersediaanRoutes)

routes.use("/form-persediaan",trxbarangpersediaanRoutes)

export default routes