const auth = require("../Other/auth")
const express = require("express")
const app = express()
app.use(express.json())

app.post("/user/", auth.authenticateUser)
app.post("/customer/", auth.authenticateCustomer)

module.exports = app