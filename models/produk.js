
/**
 * Created by riansyahPC on 11/21/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Produk = sequelize.define("Produk", {
            harga : DataTypes.INTEGER,
            berat : DataTypes.INTEGER,
            gambar : DataTypes.STRING,
            // bekas, baru
            kondisi : DataTypes.INTEGER,
            deskripsi : DataTypes.STRING,
        }, {
            classMethods: {
                associate: function(models) {
                    Produk.belongsTo(models.Kategori_Produk, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Produk;
};
