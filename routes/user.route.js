const userController = require("../controllers/user.controller")
const express = require("express")
const app = express()
// const upload=require('../controllers/user.controller').single('foto')
// const multer=require("multer")
app.use(express.json())

app.get("/", userController.getAllUser)
app.get("/:id", userController.findUser)
app.post("/", userController.addUser)
app.put("/:id", userController.updateUser)
app.delete("/:id", userController.deleteUser)

module.exports = app