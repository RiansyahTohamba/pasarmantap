/**
 * Created by riansyah on 4/21/2016.
 */
var models = require('../models');
var async = require('async');
var moment = require('moment');

verifikasiPembayaran()
function verifikasiPembayaran(){
    models.Invoice.findAll({
        where : {
            status_tampil : 2
        },
        include: [
            models.Pengguna,models.Toko,models.Produk,
            { model:models.Status,order : ['waktu']},
            {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
        ]
    }).then(function(invoice){
        console.error(invoice[0].Pengguna)
    })
}
