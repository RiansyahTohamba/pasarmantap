/**
 * Created by riansyahPC on 2/8/2016.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Bank = sequelize.define("Bank", {
            kode : {
                type : DataTypes.STRING,
                primaryKey : true
            },
            nama : DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                }
            }
        }
    );

    return Bank;
};
