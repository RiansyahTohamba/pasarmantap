/**
 * Created by riansyahPC on 11/21/2015.
 */
//var pengguna = require('../models/pengguna.js');

//ada fungsi yang router POST dan ada yang router GET
module.exports = {

    registerRoutes: function(app) {
        app.get('/customer/register', this.register);
    },

    register: function(req, res, next) {
        res.render('customer/register');
    }

};
