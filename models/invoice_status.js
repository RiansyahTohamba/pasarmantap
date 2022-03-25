/**
 * Created by riansyahPC on 11/27/2015.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Invoice_Status = sequelize.define("Invoice_Status", {
            invoiceId :  DataTypes.STRING,
            statusId :  DataTypes.INTEGER,
            waktu :  DataTypes.DATE
        }, {
            classMethods: {
                associate: function(models) {
                    Invoice_Status.belongsTo(models.Status);
                }
            }
        }
    );

    return Invoice_Status;
};
