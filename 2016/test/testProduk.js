/**
 * Created by riansyah on 4/22/2016.
 */
var models = require('../models');
var async = require('async');
//daftarProdukPembeli();
// detailProduk();

produkMilikEtalase();
function produkMilikEtalase(){
    models.Produk.findAndCountAll({
        include : models.Etalase,
        group   : 'EtalaseId',
        where   : {tokoId:1}
    }).then(function(produk){
       console.log(produk.rows[0].Etalase.nama+' - '+produk.count[0].count);
            
    })
}

function daftarWishList(){
         models.Wishlist.findAll({
            include: [{
                model: models.Produk, include :
                    [{model : models.Toko,include :
                        models.Kabupaten
                    }]
            }],
            where : {penggunaId: 1}
        }).then(function(wishList) {
            console.error(JSON.stringify(wishList));
            // res.render('pc-view/produk/daftarWishlist',{
            //     wishList : wishList
            // })
        })   
}
function daftarProdukPembeli(){
    models.Produk.findAll({
        where : {
            KategoriProdukId : 1
        },
        attributes: {exclude : ['EtalaseId'] },
        include: [{
            model: models.Toko, include :
                models.Kabupaten
        }],
        order : 'harga DESC'
    }).then(function(daftar_produk) {
        console.log(daftar_produk[0].harga);
    })
}

function detailProduk(){
    models.Wishlist.findAll({
        include: [{
            model: models.Produk, include :
                [{model : models.Toko,include :
                    models.Kabupaten
                }]
        }],
        where : [
            {penggunaId: 1},
            {produkId: 40}
        ]
    }).then(function(wishList) {
        console.log((wishList.length > 0) ? 'sudahWislist' : 'belumWislist')
    })
}
