/**
 * Created by riansyahPC on 11/27/2015.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Invoice = sequelize.define("Invoice", {
            id : {
                type : DataTypes.STRING,
                primaryKey : true
            },
            kode : DataTypes.STRING,
            total_berat : DataTypes.INTEGER,
            ongkos_kirim : DataTypes.INTEGER,
            total_harga : DataTypes.INTEGER,
            keterangan : DataTypes.STRING,
            //dari model transaksi
            tanggal : DataTypes.DATE,
            jatuh_tempo : DataTypes.DATE,
            tanggal_pembayaran : DataTypes.DATE,
            no_rekening : DataTypes.STRING,
            nama_pemilik_rekening : DataTypes.STRING,
            gambar_bukti_pembayaran : DataTypes.STRING,
            status_tampil : DataTypes.INTEGER,
            no_resi : DataTypes.INTEGER
        }, {
            classMethods: {
                associate: function(models) {
                    Invoice.belongsToMany(models.Produk, {
                        through: {
                            model: models.Invoice_Produk
                        },
                        foreignKey: 'invoiceId'
                    });
                    Invoice.belongsToMany(models.Status, {
                        through: {
                            model: models.Invoice_Status
                        },
                        foreignKey: 'invoiceId'
                    });
                    Invoice.belongsTo(models.Penerima, {
                        onDelete: "CASCADE",
                        foreignKey: { allowNull: false }
                    });
                    Invoice.belongsTo(models.Toko, {
                        onDelete: "CASCADE",
                        foreignKey: { allowNull: false }
                    });
                    //dari transaksi
                    Invoice.belongsTo(models.Pengguna, {
                        onDelete: "CASCADE",
                        foreignKey: 'pembeliId'
                    });
                    //Invoice.belongsTo(models.Bank);

                }
            }
        }
    );

    return Invoice;
};
