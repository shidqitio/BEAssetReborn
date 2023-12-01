import { check } from "express-validator";

const storePembukuanSchemas = [
    check("no_sppa").notEmpty().withMessage("no_sppa Tidak Boleh Kosong"),
    check("jumlah_barang").notEmpty().withMessage("jumlah_barang Tidak Boleh Kosong"),
    check("asal_perolehan").notEmpty().withMessage("asal_perolehan Tidak Boleh Kosong"),
    check("no_bukti_perolehan").notEmpty().withMessage("no_bukti_perolehan Tidak Boleh Kosong"),
    check("tanggal_perolehan").notEmpty().withMessage("tanggal_perolehan Tidak Boleh Kosong"),
    check("tanggal_pembukuan").notEmpty().withMessage("tanggal_pembukuan Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.kode_barang").notEmpty().withMessage("Kode_Barang Tidak Boleh Kosong").isNumeric(),
    check("DaftarBarangRequest.*.kode_asset").notEmpty().withMessage("kode_asset Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.merk").notEmpty().withMessage("merk Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.tanggal_perolehan").notEmpty().withMessage("tanggal_perolehan Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.kode_ruang").notEmpty().withMessage("kode_ruang Tidak Boleh Kosong"),
    // check("DaftarBarangRequest.*.deskripsi").notEmpty().withMessage("deskripsi Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.nilai_item").notEmpty().withMessage("nilai_item Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.kondisi").notEmpty().withMessage("kondisi Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.umur_ekonomis").notEmpty().withMessage("umur_ekonomis Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.dasar_harga").notEmpty().withMessage("dasar_harga Tidak Boleh Kosong"),
    check("DaftarBarangRequest.*.metode_penyusutan").notEmpty().withMessage("metode_penyusutan Tidak Boleh Kosong"),
]

const antriannupdetailSchema = [
    check("id").notEmpty().withMessage("Kode Pembukuan Tidak Boleh Kosong")
]

export default {
    storePembukuanSchemas,
    antriannupdetailSchema

}