const detailPController = require("../controllers/detail_pemesanan")
const express = require("express")
const app = express()
// const upload=require('../controllers/user.controller').single('foto')
// const multer=require("multer")
app.use(express.json())

app.get("/", detailPController.getAllDetailPemesanan)
app.get("/:id_pemesanan", detailPController.findDetailPemesanan)
app.get("/tanggal/:tgl_check_in/:tgl_check_out", detailPController.findTglCheckInOut)
app.get("/pemesanan/:tgl_awal/:tgl_akhir", detailPController.findTglPemesanan)
app.post("/checkout/:id_pemesanan", detailPController.checkOutCustomer);

module.exports = app