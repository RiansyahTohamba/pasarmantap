/**
 * Created by riansyahPC on 11/23/2015.
 */
var models  = require('../models');
var async  = require('async');
var formidable = require('formidable');
var credentials = require('../api/credentials.js');
var ongkir = require('../api/rajaOngkir')({
    key: credentials.rajaOngkir.key,
});

module.exports = {

    registerRoutes: function(app,checkAuth) {
        //fitur untuk non-pengguna-pembeli
        app.post('/produk/cari/',this.postCariProduk);
        app.get('/produk/urut/:kategoriId/:pilihan',this.urutkanDaftarProduk);
        app.get('/produk/daftarbykategori/:idKategori',this.daftarByKategori);
        app.get('/produk/detail/:id',this.detailProduk);
        //fitur untuk pengguna-pembeli
        app.get('/produk/beli/:idProduk',checkAuth,this.beliProduk);
        app.get('/produk/tambahpenerima/:idProduk/',checkAuth,this.formTambahPenerima);
        app.post('/produk/tambahpenerima/insert/',checkAuth,this.insertPenerima);
        //fitur untuk pengguna-penjual
        app.get('/produk/tambah',checkAuth,this.formTambahProduk);
        app.post('/produk/insert',checkAuth,this.insertProduk);
        app.get('/produk/ubah/:produkId',checkAuth,this.formUbahProduk);
        app.post('/produk/update/',checkAuth,this.updateProduk);
        app.get('/produk/hapus/:produkId',checkAuth,this.hapusProduk);
        app.get('/produk/daftar/',checkAuth,this.daftarProduk);
        app.get('/produk/jadikanwishlist/:produkId',checkAuth,this.jadikanWishlist);
        app.get('/produk/wishlist',checkAuth,this.getWishList);
    },

    formUbahProduk : function(req,res,next){
      models.Kategori_Produk.findAll()
        .then(function(kategori_produk) {
          models.Produk.find({
            where :{id:req.params.produkId}
          }).then(function(produk) {
              models.Etalase.findAll({
                where :{TokoId:res.locals.session.tokoId}
              }).then(function(etalase) {
                res.render('pc-view/produk/ubahProduk',{
                    listKategori : kategori_produk,
                    etalase : etalase,
                    produk : produk
                });
              })
          })   
      })
    },
    updateProduk : function(req,res,next){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields){
            models.Produk.update({
                nama : fields.nama,
                harga : fields.nilaiHarga,
                berat : fields.berat,
                gambar : fields.gambar,
                kondisi : fields.kondisi,
                deskripsi : fields.deskripsi,
                EtalaseId : fields.etalaseId,
                KategoriProdukId : fields.kategori
            },{
                where: { id : fields.produkId }
            }).then(function() {
                res.redirect('/produk/daftar')
            });
        })
    },
    hapusProduk : function(req,res,next){
        models.Produk.destroy({
            where :{id:req.params.produkId}
        }).then(function () {
            res.redirect('/produk/daftar');
        });        
    },
    urutkanDaftarProduk : function(req,res,next){
        models.Produk.findAll({
            where : {
                KategoriProdukId : req.params.kategoriId
            },
            attributes: {exclude : ['EtalaseId'] },
            include: [{
                model: models.Toko, include :
                    models.Kabupaten
            }],
            order : (req.params.pilihan == 1) ? 'harga ASC': 'harga DESC'
        }).then(function(listProduk) {
            var produkHTML = '';
            function numberFormat(_number, _sep) {
                _number = typeof _number != "undefined" && _number > 0 ? _number : "";
                _number = _number.replace(new RegExp("^(\\d{" + (_number.length%3? _number.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
                if(typeof _sep != "undefined" && _sep != " ") {
                    _number = _number.replace(/\s/g, _sep);
                }
                return _number;
            }
            //lakukan switch berdasarkan pilihan
            for(var val in listProduk){
                //produkHTML[val] = "<li>" +listProduk[val].nama+"</li>";
                produkHTML = produkHTML +
                    '<div style="width:160px;height:270px;float:left">' +
                        '<a href=/produk/detail/'+listProduk[val].id+' > '+
                             '<img src="/images/produk/'+listProduk[val].gambar+'"  style="height: 150px;width:140px"> <br>'+
                        '</a>'+
                        '<h4> Rp '+numberFormat(""+listProduk[val].harga,'.')+'</h4>'+
                        '<a href="/produk/detail/'+listProduk[val].id+'"> '+listProduk[val].nama+' </a><br>'+
                        '<i class="fa fa-flag"></i>  '+listProduk[val].Toko.Kabupaten.nama+'<br>' +
                        '<a href="/toko/profil/'+listProduk[val].Toko.id+'">'+listProduk[val].Toko.nama+' </a>'+
                    '</div>'
            }
            res.send({produkHTML:produkHTML});
            //res.send({produkHTML:listProduk});
        });
    },
    jadikanWishlist : function(req,res,next){
        models.Wishlist.create({
            ProdukId : req.params.produkId,
            PenggunaId : res.locals.session.penggunaId
        }).then( function() {
           res.redirect('/produk/wishlist')
        } );
    },
    postCariProduk : function(req,res,next){
        models.Produk.findAll({
            where : {
                nama : {$like: '%'+req.body.cariNamaProduk+'%'},
                kategoriProdukId :  (req.body.kategoriProdukId=='0') ?  {$not : 0} : req.body.kategoriProdukId
            },
            attributes: {exclude : ['EtalaseId'] }
        }).then(function(daftar_produk) {
            res.render('pc-view/produk/cariProduk',{
                katakunci : req.body.cariNamaProduk,
                daftar_produk : daftar_produk
            })
        })
    },
    formTambahPenerima : function(req,res,next){
        models.Provinsi.findAll().then(function(provinsi) {
            models.Toko.find({
                include: [
                    { model: models.Produk, where : {id : req.params.idProduk},as:'Produk'},
                    models.Kabupaten
                ]
            }).then(function(toko) {
                res.render('pc-view/produk/tambahPenerima',{
                    idProduk : req.params.idProduk,
                    listProvinsi : provinsi,
                    toko : toko
                })
            });
        })
    },
    insertPenerima : function(req,res,next){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields) {
            models.Penerima.create({
                jenis_alamat : fields.jenis_alamat,
                PenggunaId : fields.penggunaId,
                nama : fields.nama,
                telepon : fields.telepon,
                ProvinsiId : fields.provinsiId,
                KabupatenId : fields.kabupatenId,
                kecamatan : fields.kecamatan,
                alamat : fields.alamat
            }).then(function () {
                res.redirect('/produk/beli/' + fields.idproduk)
            });
        })
    },
    insertProduk : function(req,res,next){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields){
            models.Produk.create({  
                nama : fields.nama,
                harga : fields.nilaiHarga,
                berat : fields.berat,
                gambar : fields.gambar,
                kondisi : fields.kondisi,
                deskripsi : fields.deskripsi,
                KategoriProdukId : fields.kategori,
                EtalaseId : fields.etalaseId,
                TokoId : res.locals.session.tokoId
            }).then(function() {
                res.send('<body onload="notif()">' +
                    '<script>' +
                    'function notif(){ alert("penambahan produk berhasil"); location.href="/produk/tambah"; } ' +
                    '</script></body>');
            });
        })
    },
    getWishList: function(req,res,next){
        models.Wishlist.findAll({
            include: [{
                model: models.Produk, include :
                    [{model : models.Toko,include :
                        models.Kabupaten
                    }]
            }],
            where : {penggunaId: req.session.penggunaId}
        }).then(function(wishList) {
            res.render('pc-view/produk/daftarWishlist',{
                wishList : wishList
            })
        })
    },
    daftarByKategori : function(req, res, next){
        async.parallel([
                function(callback){
                    models.Kategori_Produk.find({
                        where : {
                            id : req.params.idKategori
                        }
                    }).then(function(kategori_produk) {
                            callback(null,kategori_produk);
                    })
                },
                function(callback){
                    models.Produk.findAll({
                        where : {
                            KategoriProdukId : req.params.idKategori
                        },
                        attributes: {exclude : ['EtalaseId'] },
                        include: [{
                            model: models.Toko, include :
                                models.Kabupaten
                        }]
                    }).then(function(daftar_produk) {
                        callback(null,daftar_produk);
                    })
                }
            ],
            function(err,result){
                res.render('pc-view/produk/daftarProdukPembeli',{
                    kategori_produk : result[0],
                    daftar_produk : result[1]
                })
            }
        )
    },

    daftarByKategoriMobile : function(req, res, next){
        async.series([
                function(callback){
                    models.Kategori_Produk.find({
                        where : {
                            id : req.params.idKategori
                        },
                        attributes: ['kategori']
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
                res.render('mobile/produk/daftarProdukPembeli',{
                    kategori_produk : result[0],
                    daftar_produk : result[1]
                })
            }
        )
    },


    beliProduk : function(req, res, next){
        var stack = {};
        stack.getPenerima = function(callback){
            models.Penerima.findAll({
                include: [
                    models.Provinsi,models.Kabupaten
                ],
                where : {penggunaId : res.locals.session.penggunaId}
            }).then(function(penerima) {
                callback(null,penerima);
            })
        };
        stack.getToko = function(callback){
            models.Toko.find({
                include: [
                    { model: models.Produk, where : {id : req.params.idProduk},as:'Produk',
                        include : [models.Kategori_Produk] },
                    models.Kabupaten
                ],
                attributes: {exclude : ['deskripsi'] }
            }).then(function(toko) {
                callback(null,toko);
            })
        };
        stack.getListProvinsi = function(callback){
            models.Provinsi.findAll().
                then(function(provinsi) {
                    callback(null,provinsi);
                })
        };
        async.parallel(stack,function(err,result){
            var beratProduk = result.getToko.Produk[0].berat;
            var idKotaTokoPenjual = result.getToko.Kabupaten.id;
            var idKotaPenerima = result.getPenerima[0].Kabupaten.id;
            //TODO: saat pengujian selesai gunakan yang versi API ini (juga kembalikan fungsi yang ada di main.getOngkir)
            //ongkir.getOngkosKirim(
            ongkir.getOngkosKirimOffline(
                idKotaTokoPenjual,idKotaPenerima,beratProduk,
                function(ongkosKirim){
                    var subTotal = ongkosKirim + result.getToko.Produk[0].harga;
                    res.render('pc-view/produk/beliProduk',{
                        toko : result.getToko,
                        penerima : result.getPenerima,
                        listProvinsi : result.getListProvinsi,
                        ongkosKirim : ongkosKirim,
                        subTotal : subTotal
                    });
                }
            );
        });
    },
    detailProduk : function(req, res, next){
        var stack = {};
        stack.getStatusWishlist = function(callback){
            models.Wishlist.findAll({
                include: [{
                    model: models.Produk, include :
                        [{model : models.Toko,include :
                            models.Kabupaten
                        }]
                }],
                where : [
                    {penggunaId: req.session.penggunaId},
                    {produkId : req.params.id}
                    ]
            }).then(function(wishList) {
                callback(null,((wishList.length > 0)) ? 'sudahWishlist' : 'belumWishlist')
            })
        };
        stack.getTokoDanProduk = function(callback){
            models.Produk.find({
                include: [
                    { model: models.Toko,
                        include : [models.Kabupaten] },
                    models.Kategori_Produk
                ],
                where : {id : req.params.id}
            }).then(function(toko) {
                callback(null,toko);
            })
        };
        stack.getJumlahTerjual = function(callback){
            models.Invoice_Produk.sum('jumlah_produk',
                {where : {produkId :req.params.id}})
                .then(function(jumlah_terjual) {
                    callback(null,jumlah_terjual);
                })
        };
        async.parallel(stack,function(err,result){
            res.render('pc-view/produk/detailProduk',{
                produk : result.getTokoDanProduk,
                jumlah_terjual : (result.getJumlahTerjual) ? result.getJumlahTerjual : 0,
                statusWishlist : result.getStatusWishlist
                //jika eror, itu karena beberapa daerah tidak bisa dilayani POS(ex:daerah lampung)
                //karenanya cari cara error handling di node js
            });
        });
    },
    detailProdukMobile : function(req, res, next){
        async.parallel([
                function(callback){
                    models.Toko.find({
                        include: [
                            { model: models.Produk, where : {id : req.params.id},as:'Produk',
                                include : [models.Kategori_Produk] },
                            models.Kabupaten
                        ]
                        //attributes: {exclude : ['Toko.deskripsi'] }
                    }).then(function(toko) {
                        callback(null,toko);
                    })
                },
                function(callback){
                    models.Provinsi.findAll()
                        .then(function(provinsi) {
                            callback(null,provinsi);
                        })
                }
            ],
            function(err,result){
                res.render('mobile/produk/detailProduk',{
                    toko : result[0],
                    provinsi : result[1]
                });
            }
        )
    },

    formTambahProduk : function(req, res, next){
        models.Kategori_Produk.findAll()
            .then(function(kategori_produk) {
              models.Etalase.findAll({
                where :{TokoId:res.locals.session.tokoId}
              }).then(function(etalase) {
                res.render('pc-view/produk/tambahProduk',{
                    kategori_produk : kategori_produk,
                    etalase : etalase,
                });
              })
            })
    },

    daftarProdukAjax : function(req, res, next){
        models.Produk.findAll({
            offset: req.params.dari, limit: 5
        }).then(function(listProduk) {
            var produkHTML = [];
            for(var val in listProduk){
                produkHTML[val] = "<td>" +
                    listProduk[val].nama+"</td>";
            }
            res.send({produkHTML:produkHTML});
        });
    },
    daftarProduk : function(req, res, next){
        async.parallel([
                function(callback){
                    models.Produk.findAll({
                        where : {
                            TokoId : res.locals.session.tokoId
                        },
                        include: [models.Kategori_Produk],
                        attributes: ['Kategori_Produk.id','Kategori_Produk.kategori'],
                        group : 'Kategori_Produk.id',
                    }).then(function(kategori_produk) {
                            callback(null,kategori_produk);
                        })
                },
                function(callback){
                    models.Etalase.findAll({
                        where : {
                            TokoId : res.locals.session.tokoId
                        }
                    }).then(function(etalase) {
                            callback(null,etalase);
                        })
                },
                function(callback){
                    // kalau tidak nyambung etalaseId di table produk dengan etalase ditable etalase (yang terhubung ke tokoId)
                    // maka jadi null dan eror nama etalasenya
                    models.Produk.findAll({
                        where : {
                            TokoId : res.locals.session.tokoId
                        },
                        include: [models.Kategori_Produk,models.Etalase],
                        attributes: {exclude : ['tokoId','EtalaseId'] }
                    }).then(function(daftar_produk) {                        
                        callback(null,daftar_produk);
                    })
                }
            ],
            function(err,result){
                res.render('pc-view/produk/daftarProduk',{
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
