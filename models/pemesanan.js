'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pemesanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.detail_pemesanan, { foreignKey: 'id_pemesanan', as: 'detail_pemesanan' });
      this.belongsTo(models.tipe_kamar, { foreignKey: 'id_tipe_kamar', as: 'tipe_kamar' });
      this.belongsTo(models.customer, { foreignKey: 'id_customer', as: 'customer' });
    }
  }
  pemesanan.init({
    id_pemesanan: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nomor_pemesan: DataTypes.STRING,
    id_customer: DataTypes.INTEGER,
    tgl_pemesanan: DataTypes.DATE,
    tgl_check_in: DataTypes.DATE,
    tgl_check_out: DataTypes.DATE,
    nama_tamu: DataTypes.STRING,
    jumlah_kamar: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.INTEGER,
    status_pemesanan: DataTypes.ENUM('baru', 'check_in', 'check_out')
  }, {
    sequelize,
    modelName: 'pemesanan',
  });
  return pemesanan;
};