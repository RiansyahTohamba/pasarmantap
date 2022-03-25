/**
 * Created by riansyah on 4/30/2016.
 */
var models = require('../models');
var async = require('async');
var moment = require('moment');

//getPengguna();

// getJumlahProdukTerjual();
getProfilPengguna();
function getProfilPengguna(){
    models.Penerima.find({
        include: [
            { model: models.Pengguna,where : {id :1},
                include : models.Toko
            },models.Kabupaten,models.Provinsi
        ]
    }).then(function(penerima) {
        console.log(penerima.toJSON());
    })
}
function getJumlahProdukTerjual(){
    function getPengguna(callback){
        models.Pengguna.find({
            where : {tokoId :2}
        }).then(function(pengguna) {
            callback(pengguna)
        });
    }
    getPengguna(function(pengguna){
        console.log(pengguna.TokoId, pengguna.id)
    })
    //models.Invoice.findAndCountAll({
    //    where : {tokoId :2,status_tampil : 1}
    //}).then(function(jumlah) {
    //    console.error(jumlah.count);
    //});
}
function getPengguna(){
    models.Pengguna.find({
        where : {
            $and : [ { sandi : 'bi'}, { email : 'drax@biji.com' } ]
        },
        include : models.Toko
    }).then(function(pengguna) {
        console.error(pengguna)
    })
}