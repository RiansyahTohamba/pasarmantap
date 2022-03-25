/**
 * Created by riansyahPC on 11/30/2015.
 */
"use strict";
module.exports = function(sequelize, DataTypes) {
    var Penerima = sequelize.define("Penerima", {
            nama : DataTypes.STRING,
            alamat : DataTypes.STRING,
            kecamatan : DataTypes.STRING,
            telepon : DataTypes.STRING,
            jenis_alamat : DataTypes.STRING,
        }, {
            classMethods: {
                associate: function(models) {
                    Penerima.belongsTo(models.Pengguna, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Penerima.belongsTo(models.Provinsi, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Penerima.belongsTo(models.Kabupaten, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Penerima;
};
