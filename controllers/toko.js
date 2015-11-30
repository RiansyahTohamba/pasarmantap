/**
 * Created by riansyahPC on 11/23/2015.
 */
var models  = require('../models');
module.exports = {

    registerRoutes: function(app) {
        app.get('/toko/profil/:id', this.profilToko);
        app.get('/toko/pengaturan/', this.pengaturan);
    },

    profilToko : function(req, res, next){
        models.Toko.find({
            where : { id : req.params.id },
            //attributes: ['kategori','deskripsi']
        }).then(function(toko) {
            res.render('toko/profilToko',{
                toko : toko
            });
        })

    }
};
