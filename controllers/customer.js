const customerModel = require(`../models/index`).customer
const md5 = require(`md5`)
const fs = require("fs")
const path = require("path")
const upload = require('../Other/upload_image_customer').single('foto')

exports.getAllCustomer = async (req, res) => {
    await customerModel.findAll()
        .then(result => {
            return res.json({
                success: true,
                message: 'Ini semua datanya',
                result: result
            })
        })
        .catch(error => {
            return res.json({
                success: false,
                message: error.message
            })
        })
}
exports.findCustomer = async (req, res) => {
    let id_customer = req.body.id
    await customerModel.findOne({ where: { id_customer: id_customer } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Ini data customer',
                result: result
            })
        })
        .catch(error => {
            return res.json({
                success: false,
                message: error.message
            })
        })
}
exports.addcustomer = async (req, res) => {
    upload(req, res, error => {
        if (error) {
            return res.json({ message: error })
        }
        if (!req.file) {
            return res.json({ message: 'Tidak ada yang diupload' })
        }
        let customerBaru = {
            nama: req.body.nama,
            foto: req.file.filename,
            email: req.body.email,
            password: md5(req.body.password),
            role: req.body.role
        }
        customerModel.create(customerBaru)
            .then(result => {
                res.json({
                    result: result,
                    message: "Berhasil menambahkan customer"
                })
            })
            .catch(error => {
                return res.json({
                    result: error.message
                })
            })
    })
}
exports.updatecustomer = async (req, res) => {
    upload(req, res, async error => {
        if (error) {
            return res.json({ message: error })
        }
        let id_customer = req.params.id
        let datacustomer = {
            nama_customer: req.body.nama_customer,
            foto: req.file.filename,
            email: req.body.email,
            role: req.body.role
        }
        if (req.file) {
            const caricustomer = await customerModel.findOne({
                where: { id_customer: id_customer }
            })
            const oldImage = caricustomer.foto
            const pathImage = path.join(__dirname, '../images/customer', oldImage)
            if (fs.existsSync(pathImage)) {
                fs.unlink(pathImage, error => console.log(error))
            }
            datacustomer.foto = req.file.filename
        }
        if (req.body.password) {
            datacustomer.password = md5(req.body.password);
        }
        if (!req.body.password) {
            delete datacustomer.password;
        }
        customerModel.update(datacustomer, { where: { id_customer: id_customer } })
            .then(result => {
                return res.json({
                    success: true,
                    message: 'Data customer sudah diupdate',
                    result: datacustomer
                })
            })
            .catch(error => {
                return res.json({
                    success: false,
                    message: error.message
                })
            })
    })
}
exports.deletecustomer = async (req, res) => {
    let id_customer = req.params.id
    let datacustomer = await customerModel.findOne({ where: { id_customer: id_customer } })
    const oldImage = datacustomer.foto
    const pathImage = path.join(__dirname, '../images/customer', oldImage)
    if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, error => console.log(error))
    }
    customerModel.destroy({ where: { id_customer: id_customer } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Data customer sudah dihapus'
            })
        })
        .catch(error => {
            return res.json({
                result: error.message
            })
        })
}