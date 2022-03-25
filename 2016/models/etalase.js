
/**
 * Created by riansyahPC on 11/21/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Etalase = sequelize.define("Etalase", {
            nama : DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Etalase.belongsTo(models.Toko, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        },

                    });
                    Etalase.hasMany(models.Produk);
                }
            }
        }
    );

    return Etalase;
};
