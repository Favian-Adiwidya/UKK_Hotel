const pemesananController = require("../controllers/pemesanan.controller")
const express = require("express")
const app = express()
// const upload=require('../controllers/user.controller').single('foto')
// const multer=require("multer")
app.use(express.json())

app.get("/",pemesananController.getAllPemesanan)
app.get("/:id",pemesananController.findTanggalPemesanan)
app.post("/",pemesananController.addPemesanan)

module.exports = app