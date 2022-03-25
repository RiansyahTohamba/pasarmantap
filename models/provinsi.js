/**
 * Created by riansyahPC on 11/28/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Provinsi = sequelize.define("Provinsi", {
            nama : DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {

                }
            }
        }
    );

    return Provinsi;
};
