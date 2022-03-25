/**
 * Created by riansyahPC on 11/21/2015.
 */
var sequelize = require("sequelize");

var models  = require('../models');
var async  = require('async');
module.exports = {

    registerRoutes: function(app,checkAuth) {
        //fitur non-pengguna atau pengguna jika ingin mengubah profil
        app.get('/pengguna/profil/:id', this.getProfil);
        app.get('/pengguna/registrasi', this.registrasi);
        //setelah registrasi,langsung dibuatkan sesi untuk masuk ke beranda
        app.post('/pengguna/registrasi/post', this.postRegistrasi);
        //fitur pengguna
        app.get('/pengguna/pengaturan-profil',checkAuth, this.pengaturanProfil);
        app.post('/pengguna/postgantiprofil/',checkAuth, this.gantiProfil);
        app.post('/pengguna/gantisandi/',checkAuth, this.gantiSandi);
        app.get('/pengguna/ceksandi/:sandilama',checkAuth, this.cekSandi);
    },

    postRegistrasi : function(req, res, next) {
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields) {
            models.Pengguna.findAll({
                where : { email :fields.email}    
            }).then(function(cekpengguna){
                if(cekpengguna.length > 0){
                    res.send('<body onload="notifGagal()">'
                                 +'<script>' +
                            'function notifGagal(){ alert("Email '+fields.email+' sudah digunakan "); location.href="/pengguna/registrasi"; } ' +
                            '</script></body>')
                }else{
                    models.Pengguna.create({
                        nama : fields.nama,
                        email : fields.email,
                        sandi : fields.sandi,
                        tokoId : 0,//diset 0 terlebih dahulu tokonya
                        foto : (fields.foto) ? fields.foto : 'default-user-photo.png',
                        jenis_kelamin : fields.jenis_kelamin
                    }).then(function(pengguna){
                        req.session.penggunaId =  pengguna.id;
                        req.session.nama =  pengguna.nama;
                        req.session.foto =  pengguna.foto;
                        req.session.tokoId =  0;
                        req.session.loggedIn =  'true';
                        res.redirect('/pc-view/beranda')
                    });
                }
            });
        });
    },
    registrasi : function(req, res, next) {
        res.render('pc-view/registrasi');
    },

    cekSandi : function(req, res, next) {
        models.Pengguna.find({
            where : { sandi : req.params.sandilama, id :req.session.penggunaId}
        }).then(function(pengguna) {
            var hasil = 'salah';
            if(pengguna){
                hasil = 'benar'
            }
            res.send(hasil);
        })
    },
    gantiSandi : function(req, res, next) {
        models.Pengguna.findAll({
            where: [
                {sandi: req.body.sandiLama},
                {id: res.locals.session.penggunaId}
            ]
        }).then(function(ceksandi){
            if(ceksandi.length == 1){
                models.Pengguna.update({
                    sandi : req.body.sandi
                },
                { where : { id : req.session.penggunaId }
                }).then(function(){
                    res.redirect('/pengguna/profil/'+(req.session.penggunaId))
                });
            }else{
                res.send('<body onload="notifGagal()">'
                         +'<script>' +
                    'function notifGagal(){ alert("Sandi lama yang dimasukkan salah "); '
                    +'location.href="/pengguna/profil/'+(res.locals.session.penggunaId)
                    +' "; }</script></body>')              
            }
        })
    },
    gantiProfil : function(req, res, next) {
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields) {
            models.Pengguna.update({
                nama : fields.nama,
                email : fields.email,
                foto : (fields.foto) ? fields.foto : 'default-user-photo.png',
                jenis_kelamin : fields.jenis_kelamin
            },{
                where: {id: res.locals.session.penggunaId}
            }).then(function(){
                res.redirect('/pengguna/profil/'+(res.locals.session.penggunaId))
            });

        });
    },
    pengaturanProfil : function(req, res, next) {
        var moment  = require('moment');
        var stack = {};

        stack.getPengguna = function(callback){
            models.Pengguna.find({
                include: [{
                    model : models.Toko,include : [models.Kabupaten,models.Provinsi]
                }],
                where : {id :res.locals.session.penggunaId}
            }).then(function(penerima) {
                callback(null,penerima);
            })
        };
        async.parallel(stack,function(err,result){
            res.render('pc-view/pengaturanProfil',{
                pengguna : result.getPengguna,
                halaman : 'pengaturanProfil'
            });
        });
    },
    getProfil : function(req, res, next) {
        var moment  = require('moment');
        var stack = {};
        function getPengguna(callback){
            models.Pengguna.find({
                where : {id :req.params.id}
            }).then(function(pengguna) {
                callback(pengguna.TokoId)
            });
        }
        stack.getJumlahProdukTerjual = function(callback){
            getPengguna(function(tokoId){
                models.Invoice_Produk.find({
                    attributes : [[sequelize.fn('SUM',sequelize.col('jumlah_produk') ),'jumlah_produk'] ]  ,
                    include: [
                        { model: models.Produk,where : {tokoId :tokoId}
                        }
                    ]
                }).then(function(jumlah) {
                    callback(null,jumlah.jumlah_produk);
                })
            })
        };
        stack.getJumlahTransaksiBerhasil = function(callback){
            getPengguna(function(tokoId){
                models.Invoice.findAndCountAll({
                    where : {tokoId :tokoId,status_tampil :'7'}
                }).then(function(jumlah) {
                    callback(null,jumlah.count);
                });
            })

        };
        stack.getPengguna = function(callback){
            models.Pengguna.find({
                include: [{
                    model : models.Toko,include : [models.Kabupaten,models.Provinsi]
                }],
                where : {id :req.params.id}
            }).then(function(penerima) {
                callback(null,penerima);
            })
        };
        async.parallel(stack,function(err,result){
            res.render('pc-view/profilPengguna',{
                pengguna : result.getPengguna,
                moment : moment,
                produkTerjual : (result.getJumlahProdukTerjual)  ? result.getJumlahProdukTerjual : '0',
                jumlahTransaksiBerhasil : result.getJumlahTransaksiBerhasil,
                halaman : 'profil'
            });
        });


    }

};
