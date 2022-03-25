/**
 * Created by riansyahPC on 11/21/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Toko = sequelize.define("Toko", {
            nama : DataTypes.STRING,
            logo : DataTypes.STRING,
            deskripsi : DataTypes.STRING,
            //TODO: kecamatan nantinya menggunakan id
            kecamatan : DataTypes.STRING,
        }, {
            classMethods: {
                associate: function(models) {
                    Toko.hasMany(models.Invoice);
                    Toko.belongsTo(models.Kabupaten);
                    Toko.belongsTo(models.Provinsi);
                    Toko.hasMany(models.Etalase);
                    Toko.hasMany(models.Produk,{as : 'Produk'});
                }
            }
        }
    );

    return Toko;
};
