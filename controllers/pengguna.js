/**
 * Created by riansyahPC on 11/21/2015.
 */
//var pengguna = require('../models/pengguna.js');

//ada fungsi yang router POST dan ada yang router GET
module.exports = {

    registerRoutes: function(app) {
        app.get('/pengguna/profil/:id', this.profil);

    },

    profil : function(req, res, next) {
        res.render('pengguna/profilDiri/profilPengguna');
    }

};
