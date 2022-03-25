/**
 * Created by riansyah on 4/29/2016.
 */
var models = require('../models');
var async = require('async');
var moment = require('moment');



statusPengiriman();
function statusPengiriman(){
    models.Invoice.findAll({
        where : {
            tokoId : 1,
            status_tampil : {$gt : 2, $lt: 8 }
        },
        include: [
            models.Pengguna,models.Toko,models.Produk,
            { model:models.Status,where : {id : {$gt : 2 } }},
            { model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
        ]
    }).then(function(Invoice) {
        console.error(Invoice)
    })
}
