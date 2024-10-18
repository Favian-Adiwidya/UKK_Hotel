const kamarModel = require(`../models/index`).kamar

exports.getAllKamar = async (req, res) => {
    await kamarModel.findAll()
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
exports.findKamar = async (req, res) => {
    let id_kamar = req.params.id
    await kamarModel.findOne({ where: { id_kamar: id_kamar } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Ini data kamar',
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
exports.addKamar = async (req, res) => {
    let inputKamar = {
        nomor_kamar: req.body.nomor_kamar,
        status: req.body.status,
        id_tipe_kamar: req.body.id_tipe_kamar
    }
    await kamarModel.create(inputKamar)
        .then(result => {
            res.json({
                message: "Berhasil menambahkan kamar",
                result: result
            })
        })
        .catch(error => {
            return res.json({
                result: error.message
            })
        })
}
exports.updateKamar = async (req, res) => {
    let id_kamar = req.params.id
    let dataKamar = {
        nomor_kamar: req.body.nomor_kamar,
        status: req.body.status,
        id_tipe_kamar: req.body.id_tipe_kamar
    }
    await kamarModel.update(dataKamar, { where: { id_kamar: id_kamar } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Kamar sudah diupdate',
                result: dataKamar
            })
        })
        .catch(error => {
            return res.json({
                success: false,
                message: error.message
            })
        })
}
exports.deleteKamar = async (req, res) => {
    let id_kamar = req.params.id
    await kamarModel.destroy({ where: { id_kamar: id_kamar } })
        .then(result => {
            return res.json({
                success: true,
                message: 'Kamar sudah dihapus'
            })
        })
        .catch(error => {
            return res.json({
                result: error.message
            })
        })
}