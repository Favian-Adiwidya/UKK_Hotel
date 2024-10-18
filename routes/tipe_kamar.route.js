const tipeKController = require("../controllers/tipe_kamar.controller")
const express = require("express")
const app = express()
// const upload=require('../controllers/user.controller').single('foto')
// const multer=require("multer")
app.use(express.json())

app.get("/",tipeKController.getAllTipeK)
app.get("/:id",tipeKController.findTipeK)
app.post("/",tipeKController.addTipeK)
app.put("/:id",tipeKController.updateTipeK)
app.delete("/:id",tipeKController.deleteTipeK)

module.exports = app