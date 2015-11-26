
/**
 * Created by riansyahPC on 11/21/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Produk = sequelize.define("Produk", {
            nama : DataTypes.STRING,
            harga : DataTypes.INTEGER,
            berat : DataTypes.INTEGER,
            gambar : DataTypes.STRING,
            kondisi : DataTypes.INTEGER,// bekas, baru
            deskripsi : DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Produk.belongsTo(models.Kategori_Produk, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Produk.belongsTo(models.Etalase, {
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
