/**
 * Created by riansyahPC on 11/21/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Kategori_Produk = sequelize.define("Kategori_Produk", {
            kategori : DataTypes.STRING
        }
    );

    return Kategori_Produk;
};
