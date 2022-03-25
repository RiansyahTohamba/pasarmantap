/**
 * Created by riansyahPC on 11/28/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Kabupaten = sequelize.define("Kabupaten", {
            nama : DataTypes.STRING,
            kode_pos : DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Kabupaten.belongsTo(models.Provinsi, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Kabupaten;
};
