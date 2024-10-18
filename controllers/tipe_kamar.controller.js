const tipeKamarModel = require(`../models/index`).tipe_kamar
const fs = require("fs")
const path = require("path")
const upload = require('../Other/upload_image_tipe_kamar').single('foto')

exports.getAllTipeK = async (req, res) => {
    await tipeKamarModel.findAll()
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
exports.findTipeK = async (req, res) => {
    let id_tipe_kamar = req.params.id
    await tipeKamarModel.findOne({ where: { id_tipe_kamar: id_tipe_kamar } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Ini data tipe kamar',
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
exports.addTipeK = async (req, res) => {
    upload(req, res, error => {
        if (error) {
            return res.json({ message: error })
        }
        if (!req.file) {
            return res.json({ message: 'Tidak ada yang diupload' })
        }
        let inputTipeK = {
            nama_tipe_kamar: req.body.nama_tipe_kamar,
            foto: req.file.filename,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi
        }
        tipeKamarModel.create(inputTipeK)
            .then(result => {
                res.json({
                    message: "Berhasil menambahkan tipe kamar",
                    result: result
                })
            })
            .catch(error => {
                return res.json({
                    result: error.message
                })
            })
    })
}
exports.updateTipeK = async (req, res) => {
    upload(req, res, async error => {
        if (error) {
            return res.json({ message: error })
        }
        let id_tipe_kamar = req.params.id
        let dataTipeK = {
            nama_tipe_kamar: req.body.nama_tipe_kamar,
            foto: req.file.filename,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi
        }
        if (req.file) {
            const cariTipeK = await tipeKamarModel.findOne({
                where: { id_tipe_kamar: id_tipe_kamar }
            })
            const oldImage = cariTipeK.foto
            const pathImage = path.join(__dirname, '../images/tipe_kamar', oldImage)
            if (fs.existsSync(pathImage)) {
                fs.unlink(pathImage, error => console.log(error))
            }
            dataTipeK.foto = req.file.filename
        }
        tipeKamarModel.update(dataTipeK, { where: { id_tipe_kamar: id_tipe_kamar } })
            .then(result => {
                return res.json({
                    success: true,
                    message: 'Tipe kamar sudah diupdate',
                    result: dataTipeK
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
exports.deleteTipeK = async (req, res) => {
    let id_tipe_kamar = req.params.id
    let dataTipeK = await tipeKamarModel.findOne({ where: { id_tipe_kamar: id_tipe_kamar } })
    const oldImage = dataTipeK.foto
    const pathImage = path.join(__dirname, '../images/tipe_kamar', oldImage)
    if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, error => console.log(error))
    }
    tipeKamarModel.destroy({ where: { id_tipe_kamar: id_tipe_kamar } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Tipe kamar sudah dihapus'
            })
        })
        .catch(error => {
            return res.json({
                result: error.message
            })
        })
}