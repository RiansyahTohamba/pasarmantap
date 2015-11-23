/**
 * Created by riansyahPC on 11/21/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Pengguna = sequelize.define("Pengguna", {
            nama : DataTypes.STRING,
            email : DataTypes.STRING,
            sandi : DataTypes.STRING,
        }, {
            classMethods: {
                associate: function(models) {
                    //Pembayaran.belongsTo(models.Pasien, {
                    //    onDelete: "CASCADE",
                    //    foreignKey: {
                    //        allowNull: false
                    //    }
                    //});
                }
            }
        }
    );

    return Pengguna;
};
