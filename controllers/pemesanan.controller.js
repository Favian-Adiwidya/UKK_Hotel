const userModel = require(`../models/index`).user
const tipeKModel = require(`../models/index`).tipe_kamar
const kamarModel = require(`../models/index`).kamar
const customerModel = require(`../models/index`).customer
const pemesananModel = require(`../models/index`).pemesanan
const detailPModel = require(`../models/index`).detail_pemesanan
const Op = require(`sequelize`).Op

exports.getAllPemesanan = async (req, res) => {
    await pemesananModel.findAll({
        include: [
            {
                model: userModel,
                as: "user"
            }, {
                model: tipeKModel,
                as: "tipe_kamar"
            }, {
                model: customerModel,
                as: "customer"
            },
        ],
    })
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
exports.findTanggalPemesanan = async (req, res) => {
    const tgl_check_in = req.body.tgl_check_in
    const tgl_check_out = req.body.tgl_check_out
    await pemesananModel.findAll({
        where: {
            [Op.or]: [
                {
                    tgl_check_in: tgl_check_in
                }, {
                    tgl_check_out: tgl_check_out
                }
            ]
        }
    })
        .then(result => {
            return res.json({
                success: true,
                message: 'Ini semua pemesanan berdasarkan tanggal',
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
exports.addPemesanan = async (req, res) => {
    try {
        let tgl_pemesanan = new Date()
        let id_tipe_kamar = req.body.id_tipe_kamar
        let id_kamar = kamarModel.findAll({ where: { id_tipe_kamar: id_tipe_kamar, status: 'Tersedia' } })
        let hargaKamar = await tipeKModel.findOne({ attributes: ['harga'], where: { id_tipe_kamar: id_tipe_kamar } })
        let jumlah_kamar = req.body.jumlah_kamar
        let id_customer = req.body.id_customer
        let nomorRandom = Math.floor(
            Math.random() * (10000000 - 99999999) + 99999999
        );
        let customer = await customerModel.findOne({ attributes: ['nama'], where: { id_customer: req.body.id_customer } })
        let kamarTersedia = await kamarModel.findAll({ where: { id_tipe_kamar: id_tipe_kamar, status: 'Tersedia' }, limit: jumlah_kamar })
        let dataPemesanan = {
            nomor_pemesan: nomorRandom,
            id_customer: id_customer,
            id_tipe_kamar: id_tipe_kamar,
            tgl_check_in: new Date(req.body.tgl_check_in),
            tgl_check_out: new Date(req.body.tgl_check_out),
            jumlah_kamar: req.body.jumlah_kamar,
            status_pemesanan: "Check_In",
            nama_tamu: customer.nama,
            tgl_pemesanan: tgl_pemesanan
        }
        if (kamarModel.status == "Dipesan") {
            return res.json({
                success: false,
                message: error.message
            })
        }
        let pemesanan = await pemesananModel.create(dataPemesanan)
        for (let a = 0; a < jumlah_kamar; a++) {
            let kamar = kamarTersedia[a]
            await detailPModel.create({
                id_pemesanan: pemesanan.id_pemesanan,
                id_customer: id_customer,
                id_kamar: kamar.id_kamar,
                tgl_akses: new Date(),
                harga: hargaKamar.harga
            })
            await kamarModel.update({ status: "Dipesan" }, { where: { id_kamar: kamar.id_kamar } })
        }
        return res.json({
            success: true,
            message: 'Berhasil memesan kamar',
            result: dataPemesanan
        })
    }
    catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}