const userModel = require(`../models/index`).user
const md5 = require(`md5`)
const fs = require("fs")
const where = require("sequelize")
const Op = require(`sequelize`).Op
const multer = require("multer")
const path = require("path")
const upload = require('../Other/upload_image_user').single('foto')

exports.getAllUser = async (req, res) => {
    await userModel.findAll()
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
exports.findUser = async (req, res) => {
    let id_user = req.params.id
    await userModel.findOne({ where: { id_user: id_user } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Ini data user',
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
exports.addUser = async (req, res) => {
    upload(req, res, error => {
        if (error) {
            return res.json({ message: error })
        }
        if (!req.file) {
            return res.json({ message: 'Tidak ada yang diupload' })
        }
        let userBaru = {
            nama_user: req.body.nama_user,
            foto: req.file.filename,
            email: req.body.email,
            password: md5(req.body.password),
            role: req.body.role
        }
        if (userBaru.email==userModel.findOne({where:{email:userBaru.email}})) {
            return res.json({
                success:false,
                message:"Email tidak tersedia"
            })
        }
        userModel.create(userBaru)
            .then(result => {
                res.json({
                    result: result,
                    message: "Berhasil menambahkan"
                })
            })
            .catch(error => {
                return res.json({
                    result: error.message
                })
            })
    })
}
exports.updateUser = async (req, res) => {
    upload(req, res, async error => {
        if (error) {
            return res.json({ message: error })
        }
        let id_user = req.params.id
        let dataUser = {
            nama_user: req.body.nama_user,
            foto: req.file.filename,
            email: req.body.email,
            role: req.body.role
        }
        if (req.file) {
            const cariUser = await userModel.findOne({
                where: { id_user: id_user }
            })
            const oldImage = cariUser.foto
            const pathImage = path.join(__dirname, '../images/user', oldImage)
            if (fs.existsSync(pathImage)) {
                fs.unlink(pathImage, error => console.log(error))
            }
            dataUser.foto = req.file.filename
        }
        if (req.body.password) {
            dataUser.password = md5(req.body.password);
        }
        if (!req.body.password) {
            delete dataUser.password;
        }
        userModel.update(dataUser, { where: { id_user: id_user } })
            .then(result => {
                return res.json({
                    success: true,
                    message: 'Data user sudah diupdate',
                    result: dataUser
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
exports.deleteUser = async (req, res) => {
    let id_user = req.params.id
    let dataUser = await userModel.findOne({ where: { id_user: id_user } })
    const oldImage = dataUser.foto
    const pathImage = path.join(__dirname, '../images/user', oldImage)
    if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, error => console.log(error))
    }
    userModel.destroy({ where: { id_user: id_user } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Data user sudah dihapus'
            })
        })
        .catch(error => {
            return res.json({
                result: error.message
            })
        })
}