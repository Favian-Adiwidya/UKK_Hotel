const {authenticate}=require("../Other/auth")
const express = require("express")
const app = express()
app.use(express.json())

app.post("/",authenticate)

module.exports=app