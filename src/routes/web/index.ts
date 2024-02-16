import express from "express";
const routes = express.Router();
import authenticate from "../../middlewares/auth";
//ASSET
import assetRoutes from "./asset-route"
import pembukuanRoutes from "./pembukuan-route"
import daftarbarangRoutes from "./daftarbarang-route"
import ruangRoutes from "./ruang-route"
import trxinventarisasiRoutes from "./trxinventarisasi-route"

//PERSEDIAAN
import assetpersediaanRoutes from "./assetpersediaan-route"
import trxbarangpersediaanRoutes from "./trxbarangpersediaan-route"
import trxrequestpemakaianRoutes from "./trxrequestpemakaian-route"
import assetmasterRoutes from "./assetmaster-route"


// REKLASIFIKASI
import reklasifikasiRoutes from "./reklasifikasi-route";

// LAPORAN PERSEDIAAN
import laporanPersediaanRoutes from "./laporanpersediaan-route"
import laporanRincianBarangRoutes from "./laporanrincian-barang-route"

//ROUTING
routes.use("/asset",assetRoutes)

routes.use("/pembukuan",pembukuanRoutes)

routes.use("/barang", daftarbarangRoutes)

routes.use("/ruang", ruangRoutes)

routes.use("/asset-persediaan", assetpersediaanRoutes)

routes.use("/form-persediaan",trxbarangpersediaanRoutes)

routes.use("/inventarisasi", trxinventarisasiRoutes)

routes.use("/request-pemakaian", trxrequestpemakaianRoutes)

routes.use("/asset-master", assetmasterRoutes)

// REKLASIFIKASI
routes.use("/reklasifikasi", reklasifikasiRoutes)


// LAPORAN
routes.use("/laporan-barang-persediaan", laporanPersediaanRoutes)

routes.use("/laporan-rincian-barang", laporanRincianBarangRoutes)

export default routes