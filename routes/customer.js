const customerController = require("../controllers/customer")
const express = require("express")
const app = express()
// const upload=require('../controllers/user.controller').single('foto')
// const multer=require("multer")
app.use(express.json())

app.get("/", customerController.getAllCustomer)
app.post("/:id", customerController.findCustomer)
app.post("/", customerController.addcustomer)
app.put("/:id", customerController.updatecustomer)
app.delete("/:id", customerController.deletecustomer)

module.exports = app