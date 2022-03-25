/**
 * Created by riansyahPC on 11/21/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Pengguna = sequelize.define("Pengguna", {
            email : DataTypes.STRING,
            sandi : DataTypes.STRING,
            nama : DataTypes.STRING,
            jenis_kelamin : DataTypes.INTEGER,
            foto : DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Pengguna.belongsTo(models.Toko);
                    Pengguna.hasMany(models.Penerima);
                }
            }
        }
    );

    return Pengguna;
};
