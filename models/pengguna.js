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
                    Pengguna.belongsTo(models.Provinsi, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Pengguna.belongsTo(models.Kabupaten, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Pengguna;
};
