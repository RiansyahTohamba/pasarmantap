/**
 * Created by riansyahPC on 11/27/2015.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Wishlist = sequelize.define("Wishlist", {
        }, {
            classMethods: {
                associate: function(models) {
                    Wishlist.belongsTo(models.Produk, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Wishlist.belongsTo(models.Pengguna, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Wishlist;
};
