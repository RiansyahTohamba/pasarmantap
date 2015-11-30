/**
 * Created by riansyahPC on 11/23/2015.
 */
var models  = require('../models');
var async  = require('async');
module.exports = {

    registerRoutes: function(app,checkAuth) {
        //ada daftar produk untuk penjual ada untuk pembelian

        //fitur untuk pembeli
        app.get('/produk/daftarbykategori/:idKategori',this.daftarByKategori);
        app.get('/produk/detail/:id',this.detailProduk);

        //fitur untuk penjual
        app.get('/produk/tambah',checkAuth,this.tambahProduk);
        app.get('/produk/daftar',checkAuth,this.daftarProduk);
    },

    daftarByKategori : function(req, res, next){
        async.series([
                function(callback){
                    models.Kategori_Produk.find({
                        where : {
                            id : req.params.idKategori
                        },
                        attributes: ['kategori','deskripsi']
                    }).then(function(kategori_produk) {
                            callback(null,kategori_produk);
                    })
                },
                function(callback){
                    models.Produk.findAll({
                        where : {
                            KategoriProdukId : req.params.idKategori
                        },
                        attributes: {exclude : ['EtalaseId'] }
                    }).then(function(daftar_produk) {
                        callback(null,daftar_produk);
                    })
                }
            ],
            function(err,result){
                res.render('pengguna/produk/daftarProdukPembeli',{
                    kategori_produk : result[0],
                    daftar_produk : result[1]
                })
            }
        )
    },


    detailProduk : function(req, res, next){
        models.Produk.find({
            where : {
                id : req.params.id
            },
            include: [
                { model: models.Etalase, include: [
                    { model: models.Toko }
                ]}
            ],
            attributes: {exclude : ['Toko.deskripsi'] }
        }).then(function(produk) {
                res.render('pengguna/produk/detailProduk',{
                    produk : produk
                });
            })
    },

    tambahProduk : function(req, res, next){
        models.Kategori_Produk.findAll()
            .then(function(kategori_produk) {
                res.render('pengguna/produk/tambahProduk',{
                    kategori_produk : kategori_produk
                });
            })
    },

    daftarProduk : function(req, res, next){
        async.series([
                function(callback){
                    models.Kategori_Produk.findAll()
                        .then(function(kategori_produk) {
                            callback(null,kategori_produk);
                        })
                },
                function(callback){
                    models.Etalase.findAll()
                        .then(function(etalase) {
                            callback(null,etalase);
                        })
                },
                function(callback){
                    models.Produk.findAll({
                        where : {
                            tokoId : 1
                        },
                        include: [models.Kategori_Produk,models.Etalase],
                        attributes: {exclude : ['tokoId','EtalaseId'] }
                    }).then(function(daftar_produk) {
                        callback(null,daftar_produk);
                    })
                }
            ],
            function(err,result){
                res.render('pengguna/produk/daftarProduk',{
                    kategori_produk : result[0],
                    etalase : result[1],
                    daftar_produk : result[2]
                })
            }
        )
    },
    cekTambah : function(req, res, next){
    },

};
