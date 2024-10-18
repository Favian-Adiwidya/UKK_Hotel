const kamarController = require("../controllers/kamar.controller")
const express = require("express")
const app = express()
// const upload=require('../controllers/user.controller').single('foto')
// const multer=require("multer")
app.use(express.json())

app.get("/", kamarController.getAllKamar)
app.get("/:id", kamarController.findKamar)
app.post("/", kamarController.addKamar)
app.put("/:id", kamarController.updateKamar)
app.delete("/:id", kamarController.deleteKamar)

module.exports = app