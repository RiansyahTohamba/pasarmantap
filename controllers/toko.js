/**
 * Created by riansyahPC on 11/23/2015.
 */
var async = require('async');
var models  = require('../models');
var sequelize = require("sequelize");
var statusTampil = require('../statusTampil');
module.exports = {

    registerRoutes: function(app,checkAuth) {
        //fitur pembeli
        app.get('/toko/profil/:tokoId/:idEtalase', this.profilToko);
        app.get('/toko/profil/:tokoId/', this.profilToko);
        //fitur penjual
        app.get('/toko/buka/', checkAuth,this.bukaToko);
        app.post('/toko/post-buka/', checkAuth,this.postBukaToko);
        app.get('/toko/pengaturan/',checkAuth, this.pengaturanToko);
        app.get('/toko/hapus-etalase/:etalaseId/:namaEtalase',checkAuth, this.hapusEtalase);
        app.post('/toko/tambah-etalase/',checkAuth, this.tambahEtalase);
        app.post('/toko/ubah-etalase/',checkAuth, this.ubahEtalase);
        app.post('/toko/post-ubah-toko/',checkAuth, this.ubahToko);
    },

    ubahToko : function(req, res, next){
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields) {
            models.Toko.findAll({
                where : 
                     { nama : fields.nama } 
            }).then(function(cekpengguna) {
                if(cekpengguna.length > 0){
                    res.send('<body onload="notifGagal()">' +
                        '<script>' +
                            'function notifGagal(){ alert("Nama Toko '+fields.nama+' sudah ada yang menggunakan"); location.href="/pc-view/beranda"; } ' +
                        '</script></body>')
                }else{
                    models.Pengguna.update({
                        TokoId : toko.id
                    },{
                        where: { id : res.locals.session.penggunaId }
                    }).then(function(){
                        req.session.namaToko = fields.nama
                        req.session.tokoId = toko.id
                        res.redirect('/pc-view/beranda');
                    })   
                }
            });
        });
    },
    hapusEtalase : function(req, res, next){
        models.Produk.findAll({
            where : { EtalaseId :req.params.etalaseId}    
        }).then(function(cekEtalase){
            if(cekEtalase.length > 0){
                res.send('<body onload="notifGagal()">'
                             +'<script>' +
                        'function notifGagal(){ alert("pindahkan produk di etalase '+req.params.namaEtalase+'terlebih dahulu "); '+
                        'location.href="/produk/daftar"; } ' +
                        '</script></body>')
            }else{
                models.Etalase.destroy(
                    { where : {id : req.params.etalaseId} }
                ).then(function(){
                    res.redirect('/toko/pengaturan#daftarEtalase');
                });        
            }
        })        
    },
    ubahEtalase : function(req, res, next){
        models.Etalase.findAll({
            where : { nama :req.body.namaEtalase}    
        }).then(function(cekEtalase){
            if(cekEtalase.length > 0){
                res.send('<body onload="notifGagal()">'
                             +'<script>' +
                        'function notifGagal(){ alert("Nama '+req.body.namaEtalase+' sudah digunakan "); '+
                        'location.href="/toko/pengaturan#daftarEtalase"; } ' +
                        '</script></body>')
            }else{
                models.Etalase.update({
                    nama : req.body.namaEtalase
                },{ where : {id : req.body.etalaseId} }
                ).then(function(){
                    res.redirect('/toko/pengaturan#daftarEtalase');
                });
            }
        })
    },
    tambahEtalase : function(req, res, next){
        models.Etalase.findAll({
            where : { nama :req.body.namaEtalase}    
        }).then(function(cekEtalase){
            if(cekEtalase.length > 0){
                res.send('<body onload="notifGagal()">'
                             +'<script>' +
                        'function notifGagal(){ alert("Nama '+req.body.namaEtalase+' sudah digunakan "); '+
                        'location.href="/toko/pengaturan#daftarEtalase"; } ' +
                        '</script></body>')
            }else{
                models.Etalase.create({
                    nama : req.body.namaEtalase,
                    TokoId : res.locals.session.tokoId
                }).then(function(){
                    res.redirect('/toko/pengaturan#daftarEtalase');
                });
            }        
        })
    },
    bukaToko : function(req, res, next){
        if(res.locals.session.tokoId != 0){
            res.redirect('/pc-view/beranda')
        }else{
            models.Provinsi.findAll()
            .then(function(listProvinsi){
                res.render('pc-view/toko/bukaToko',{
                    listProvinsi : listProvinsi
                });
            })
        }
    },
    postBukaToko : function(req, res, next){
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields) {
            models.Toko.findAll({
                where : 
                     { nama : fields.nama } 
            }).then(function(cekpengguna) {
                if(cekpengguna.length > 0){
                    res.send('<body onload="notifGagal()">' +
                        '<script>' +
                            'function notifGagal(){ alert("Nama Toko '+fields.nama+' sudah ada yang menggunakan"); location.href="/pc-view/beranda"; } ' +
                        '</script></body>')
                }else{
                    models.Toko.create({
                        nama : fields.nama,
                        logo : (fields.logo) ? fields.logo : 'logo-toko.png',
                        deskripsi : fields.deskripsi,
                        ProvinsiId : fields.provinsiId,
                        KabupatenId : fields.kabupatenId,
                        kecamatan : fields.kecamatan
                    }).then(function(toko){
                        models.Etalase.create({
                            nama : 'lain-lain',
                            TokoId : toko.id
                        }).then(function(){
                            models.Pengguna.update({
                                TokoId : toko.id
                            },{
                                where: { id : res.locals.session.penggunaId }
                            }).then(function(){
                                req.session.namaToko = fields.nama
                                req.session.tokoId = toko.id
                                res.redirect('/pc-view/beranda');
                            })
                        })
                    })   
                }
            });
        });
    },

    pengaturanToko : function(req, res, next){
        models.Toko.find({
            include : [models.Kabupaten,models.Provinsi],
            where   : {id:res.locals.session.tokoId}
        }).then(function(toko){            
            models.Etalase.findAll({
                where   : {TokoId:res.locals.session.tokoId}                
            }).then(function(etalase){
                models.Provinsi.findAll()
                .then(function(provinsi){
                   models.Kabupaten.findAll()
                   .then(function(kabupaten){
                        res.render('pc-view/toko/pengaturanToko',{
                            toko : toko,
                            etalase : etalase,
                            listProvinsi : provinsi,
                            listKabupaten : kabupaten
                        });
                   })  
                })
            })
        });
    },


    profilToko : function(req, res, next){
        var stack = {};
        if(req.params.idEtalase){
            stack.getProdukMilikEtalase = function(callback){
                models.Toko.find({
                    include: [
                        { model: models.Produk,as:'Produk',where : {etalaseId :req.params.idEtalase},
                            include : models.Etalase
                        },models.Kabupaten
                    ],
                    where : { id : req.params.tokoId }
                }).then(function(toko) {
                   callback(null,toko);                    
                })
            }
        }else{
            stack.getProdukMilikEtalase = function(callback){
                models.Toko.find({
                    include: [
                        { model: models.Produk,as:'Produk'},models.Kabupaten
                    ],
                    where : { id : req.params.tokoId }
                }).then(function(toko) {
                    callback(null,toko);
                })
            }
        }

        stack.getEtalase = function(callback){
            //yang diambil etalase yang memiliki  produk saja 
             models.Produk.findAndCountAll({
                include : models.Etalase,
                group   : 'etalaseId',
                where   : {tokoId:req.params.tokoId}
            }).then(function(etalase){
                callback(null,etalase);
            })
        };
        stack.getJumlahProdukTerjual = function(callback){
            models.Invoice_Produk.find({
                attributes : [[sequelize.fn('SUM',sequelize.col('jumlah_produk') ),'jumlah_produk'] ]  ,
                include: [
                    { model: models.Produk,where : {tokoId :req.params.tokoId}
                    }
                ]
            }).then(function(jumlah) {
                callback(null,jumlah.jumlah_produk);
            })
        };
        stack.getJumlahTransaksiBerhasil = function(callback){
            models.Invoice.findAndCountAll({
                where : {tokoId :req.params.tokoId,status_tampil :statusTampil.pesananDiterima}
            }).then(function(jumlah) {
                callback(null,jumlah);
            });
        };
        async.parallel(stack,function(err,result){
            if(!req.params.idEtalase){
                var namaEtalase = 'Semua Etalase';
            }else{
                var namaEtalase = result.getProdukMilikEtalase.Produk[0].Etalase.nama;
            }
            res.render('pc-view/toko/daftarProdukPerEtalase',{
                toko : result.getProdukMilikEtalase,
                etalase : result.getEtalase,
                produkTerjual : (result.getJumlahProdukTerjual)  ? result.getJumlahProdukTerjual : '0',
                jumlahTransaksiBerhasil : result.getJumlahTransaksiBerhasil.count,
                namaEtalase : namaEtalase
            });
        });
    }
};
