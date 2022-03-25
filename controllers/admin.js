/**
 * Created by riansyahPC on 11/23/2015.
 */
var moment = require("moment");
var async = require('async');
var models  = require('../models');
var sequelize = require("sequelize");
var statusTampil = require('../statusTampil');

module.exports = {
    registerRoutes: function(app,checkAuth) {
        //nanti dibuatkan cek-auth untuk superadmin
        app.get('/admin/verifikasipembayaran/:status', this.getVerifikasiPembayaran);
        app.get('/admin/verifikasipembayaran/update/:invoiceId', this.updateVerifikasiPembayaran);
        app.get('/admin/dalampengiriman/',this.getDalamPengiriman);        
        app.get('/admin/sampaiditujuan/',this.getInvoiceSukses);        
        //todo: dibedakan halamannya untuk konfirmasi kurir ke pasarmantap bahwa pengiriman telah sampai
        app.get('/admin/batalkanpengiriman/:invoiceId',this.batalkanPengiriman);
    },
    getInvoiceSukses : function(req, res, next){
        models.Invoice.findAll({
            where : {
                status_tampil : {$or : [statusTampil.pesananDiterima,
                    statusTampil.logTransaksiDihapus] }
            },
            include: [
                models.Pengguna,models.Toko,models.Produk,
                { model:models.Status,order : ['waktu']},
                {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(invoice){
            res.render('pc-view/admin/dalampengiriman', {
                moment : moment,
                invoice : invoice,
                status : statusTampil.pesananDiterima,
            })
        });
    },
    getDalamPengiriman : function(req, res, next){
        models.Invoice.findAll({
            where : {
                status_tampil : statusTampil.pesananTelahDikirim
            },
            include: [
                models.Pengguna,models.Toko,models.Produk,
                { model:models.Status,order : ['waktu']},
                {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(invoice){
            res.render('pc-view/admin/dalamPengiriman', {
                moment : moment,
                invoice : invoice,
                status : statusTampil.pesananTelahDikirim
            })
        });
    },
    //jika terjadi suatu hal saat pengiriman
    batalkanPengiriman : function(req, res, next){
        models.Invoice.update({
            status_tampil : statusTampil.pesananDibatalkanPenjual
        },{
            where: { id : req.params.invoiceId }
        }).then(function() {
            var now = moment();
            models.Invoice_Status.create({
                invoiceId : req.params.invoiceId,
                statusId : statusTampil.pesananDibatalkanPenjual,
                waktu : moment(now).format('YYYY-MM-DD HH:mm')
            }).then(function() {
                res.redirect('/admin/dalampengiriman');
            })
        });
    },
    updateVerifikasiPembayaran : function(req, res, next){
        models.Invoice.update({
            status_tampil : statusTampil.sudahVerifikasiPembayaran
        },{
            where: { id : req.params.invoiceId }
        }).then(function() {
            var now = moment();
            models.Invoice_Status.create({
                invoiceId : req.params.invoiceId,
                statusId : sudahVerifikasiPembayaran,
                waktu : moment(now).format('YYYY-MM-DD HH:mm')
            }).then(function() {
                res.redirect('/admin/verifikasipembayaran/belum');
            })
        });
    },
    getVerifikasiPembayaran : function(req, res, next){
        var status_tampil = {};
        if(req.params.status == 'sudah'){
            status_tampil = statusTampil.sudahVerifikasiPembayaran;
        }else if(req.params.status == 'belum'){
            status_tampil = statusTampil.sudahKonfirmasiPembayaran;
        }
        models.Invoice.findAll({
            where : {
                status_tampil : status_tampil
            },
            include: [
                models.Pengguna,models.Toko,models.Produk,
                { model:models.Status,order : ['waktu']},
                {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(invoice){
            res.render('pc-view/admin/verifikasiPembayaran', {
                moment : moment,
                invoice : invoice,
                status : req.params.status
            })
        });
    },

};
