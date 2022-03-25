
/**
 * Created by riansyahPC on 11/21/2015.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Status = sequelize.define("Status", {
            pelaku : DataTypes.STRING,
            pesan : DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Status.belongsToMany(models.Invoice, {
                        through: {
                            model: models.Invoice_Status
                        },
                        foreignKey: 'statusId'
                    });

                }
            }
        }
    );
    return Status;
};
