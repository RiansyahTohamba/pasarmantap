/**
 * Created by riansyahPC on 11/23/2015.
 */
var models  = require('../models');
var moment = require("moment");
var statusTampil = require('../statusTampil');
module.exports = {

    registerRoutes: function(app,checkAuth) {
        app.get('/penjualan/daftarpenjualan',checkAuth,this.daftarPenjualan);
        app.get('/penjualan/pesananbaru',checkAuth,this.getListPesananBaru);
        app.get('/penjualan/pesananbaru/update/:status/:invoiceId',checkAuth,this.updatePesananBaru);
        app.get('/penjualan/konfirmasipengiriman',checkAuth,this.getListKonfirmasiPengiriman);
        app.post('/penjualan/konfirmasipengiriman/update',checkAuth,this.pesananTelahDikirim);
        app.get('/penjualan/konfirmasipengiriman/batal/:invoiceId',checkAuth,this.batalkanKonfirmasiPengiriman);
        app.get('/penjualan/statuspengiriman',checkAuth,this.getListStatusPengiriman);
    },

    daftarPenjualan : function(req, res, next){
        models.Invoice.findAll({
            where : {
                tokoId : res.locals.session.tokoId,
                status_tampil : {$not : statusTampil.logTransaksiDihapus}
            },
            include: [
                models.Pengguna,models.Toko,models.Produk,
                { model:models.Status},
                {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(Invoice){
            //res.send(Invoice);
            res.render('pc-view/penjualan/daftarPenjualan', {
                tabMenu: 'Daftar Invoice Penjualan',
                moment : moment,
                Invoice : Invoice
            })
        });
    },

    updatePesananBaru : function(req, res, next){
        var status_tampil = statusTampil.pesananSedangDiproses;
        if(req.params.status == 'tolak'){
            status_tampil = statusTampil.pesananDibatalkanPenjual;
        }
        var now = moment();
        models.Invoice.update({
            status_tampil : status_tampil,
            jatuh_tempo : moment(now).add(3,'days')//jatuh tempo
        },{
            where: { id : req.params.invoiceId }
        }).then(function() {
            var now = moment();
            models.Invoice_Status.create({
                invoiceId : req.params.invoiceId,
                statusId : status_tampil,
                waktu : moment(now).format('YYYY-MM-DD HH:mm')
            }).then(function() {
                res.redirect('/penjualan/pesananbaru');
            })
        });
    },
    getListPesananBaru : function(req, res, next){
        models.Invoice.findAll({
            where : {
                tokoId : res.locals.session.tokoId,
                status_tampil : statusTampil.sudahVerifikasiPembayaran
            },
            include: [
                models.Pengguna,models.Toko,
                { model:models.Status,where : {id : statusTampil.sudahVerifikasiPembayaran }},
                { model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(Invoice){
            res.render('pc-view/penjualan/pesananBaru', {
                tabMenu: 'Pesanan Baru',
                Invoice : Invoice,
                moment : moment
            });
        });
    },

    batalkanKonfirmasiPengiriman : function(req, res, next){
        models.Invoice.update({
            status_tampil : statusTampil.pesananDibatalkanPenjual,
        },{
            where: { id : req.params.invoiceId }
        }).then(function() {
            var now = moment();
            models.Invoice_Status.create({
                invoiceId : req.params.invoiceId,
                statusId : statusTampil.pesananDibatalkanPenjual,
                waktu : moment(now).format('YYYY-MM-DD HH:mm')
            }).then(function() {
                res.redirect('/penjualan/konfirmasipengiriman');
            })
        });
    },
    pesananTelahDikirim : function(req, res, next){
        var now = moment();
        models.Invoice.update({
            status_tampil : statusTampil.pesananTelahDikirim,
            no_resi : req.body.noresi,
            jatuh_tempo : moment(now).add(3,'days')//jatuh tempo
        },{
            where: { id : req.body.invoiceId }
        }).then(function() {
            models.Invoice_Status.create({
                invoiceId : req.body.invoiceId,
                statusId : statusTampil.pesananTelahDikirim,
                waktu : moment(now).format('YYYY-MM-DD HH:mm')
            }).then(function() {
                res.redirect('/penjualan/konfirmasipengiriman');
            })
        });
    },
    getListKonfirmasiPengiriman : function(req, res, next){
        models.Invoice.findAll({
            where : {
                tokoId : res.locals.session.tokoId,
                status_tampil : statusTampil.pesananSedangDiproses
            },
            include: [
                models.Pengguna,models.Toko,
                { model:models.Status,where : {id : statusTampil.pesananSedangDiproses  }},
                { model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(Invoice) {
            res.render('pc-view/penjualan/konfirmasiPengiriman', {
                tabMenu: 'Konfirmasi Pengiriman',
                Invoice: Invoice,
                moment: moment,
            });
        })
    },

    getListStatusPengiriman: function(req, res, next){
        models.Invoice.findAll({
            where : {
                tokoId : res.locals.session.tokoId,
                status_tampil : {$lt : statusTampil.logTransaksiDihapus }
            },
            include: [
                models.Pengguna,models.Toko,models.Produk,
                { model:models.Status},
                { model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(Invoice){
            res.render('pc-view/penjualan/statusPengiriman', {
                tabMenu: 'Status Pengiriman',
                Invoice : Invoice,
                moment : moment
            });
        });
    }
};
