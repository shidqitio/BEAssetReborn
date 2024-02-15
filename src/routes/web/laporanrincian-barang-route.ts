import express from 'express'
const routes = express.Router()
import laporanRincianBarang from '../../controllers/web/laporanrincian-barang-controller';

// laporan detail
routes.get("/saldo-awal", laporanRincianBarang.getAllSaldoAwal)
routes.get("/:tahun", laporanRincianBarang.getByTahun)
routes.get("/unit/:kode_unit", laporanRincianBarang.getByUnit)
routes.get("/", laporanRincianBarang.getAll)

export default routes