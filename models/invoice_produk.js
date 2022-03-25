/**
 * Created by riansyahPC on 11/27/2015.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Invoice_Produk = sequelize.define("Invoice_Produk", {
            invoiceId :  DataTypes.STRING,
            produkId :  DataTypes.INTEGER,
            jumlah_produk :  DataTypes.INTEGER
        }, {
            classMethods: {
                associate: function(models) {
                    Invoice_Produk.belongsTo(models.Produk);
                }
            }
        }
    );

    return Invoice_Produk;
};
