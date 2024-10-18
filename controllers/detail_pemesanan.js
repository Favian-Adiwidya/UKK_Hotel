const detailPModel = require(`../models/index`).detail_pemesanan
const tipeKModel = require(`../models/index`).tipe_kamar
const kamarModel = require(`../models/index`).kamar
const customerModel = require(`../models/index`).customer
const pemesananModel = require(`../models/index`).pemesanan
const Op = require(`sequelize`).Op

exports.getAllDetailPemesanan = async (req, res) => {
    await detailPModel.findAll()
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
exports.findDetailPemesanan = async (req, res) => {
    try {
        let id_pemesanan = req.params.id_pemesanan;

        let pemesanan = await pemesananModel.findOne({
            where: {
                id_pemesanan: id_pemesanan
            }
        });

        if (!pemesanan) {
            return res.json({
                success: false,
                message: "Pemesanan tidak ditemukan untuk ID pemesanan tersebut"
            });
        }

        let id_customer = pemesanan.id_customer;
        let tgl_pemesanan = pemesanan.tgl_pemesanan;
        let id_tipe_kamar = pemesanan.id_tipe_kamar;
        let jumlah_kamar = pemesanan.jumlah_kamar;

        let hargaKamar = await tipeKModel.findOne({
            attributes: ['harga'],
            where: {
                id_tipe_kamar: id_tipe_kamar
            }
        });

        if (!hargaKamar) {
            return res.json({
                success: false,
                message: "Harga kamar tidak ditemukan untuk tipe kamar tersebut"
            });
        }

        const Total = hargaKamar.harga * jumlah_kamar;

        let detailPemesanan = await detailPModel.findAll({
            where: {
                tgl_akses: tgl_pemesanan
            },
            include: [{
                model: customerModel,
                as: "customer",
                where: {
                    id_customer: id_customer
                }
            }, {
                model: pemesananModel,
                as: "pemesanan",
                where: {
                    id_pemesanan: id_pemesanan
                }
            }, {
                model: kamarModel,
                as: "kamar"
            }]
        });

        if (!detailPemesanan || detailPemesanan.length === 0) {
            return res.json({
                success: false,
                message: "Detail pemesanan tidak ditemukan untuk tgl_pemesanan tersebut"
            });
        }

        return res.json({
            success: true,
            message: 'Ini data pemesanan',
            result: {
                Hotel: "Wikusama Hotel",
                dataPemesanan: detailPemesanan,
                Total_Harga: Total
            }
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}
exports.findTglPemesanan = async (req, res) => {
    try {
        const tgl_check_in = req.params.tgl_check_in;
        const tgl_check_out = req.params.tgl_check_out;

        let pemesanan = await pemesananModel.findAll({
            where: {
                tgl_check_in: {
                    [Op.between]: [tgl_check_in, tgl_check_out]
                },
                tgl_check_out: {
                    [Op.between]: [tgl_check_in, tgl_check_out]
                }
            },
            include: [
                {
                    model: customerModel,
                    as: 'customer'
                }
            ]
        });

        if (!pemesanan || pemesanan.length === 0) {
            return res.json({
                success: false,
                message: "Tidak ada pemesanan ditemukan untuk tanggal check-in dan check-out tersebut"
            });
        }

        const idPemesananList = pemesanan.map(p => p.id_pemesanan);

        let detailPemesanan = await detailPModel.findAll({
            where: {
                id_pemesanan: idPemesananList
            },
            include: [
                {
                    model: pemesananModel,
                    as: 'pemesanan'
                },
                {
                    model: customerModel,
                    as: 'customer'
                }
            ]
        });

        if (!detailPemesanan || detailPemesanan.length === 0) {
            return res.json({
                success: false,
                message: "Detail pemesanan tidak ditemukan untuk tanggal tersebut"
            });
        }

        return res.json({
            success: true,
            message: 'Data pemesanan berdasarkan tanggal berhasil ditemukan',
            result: {
                pemesanan,
                detailPemesanan
            }
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}