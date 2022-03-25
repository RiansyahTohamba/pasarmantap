/**
 * Created by riansyahPC on 11/23/2015.
 */
var models  = require('../models');
var sequelize = require("sequelize");
var moment = require("moment");
var formidable = require('formidable');
var statusTampil = require('../statusTampil');
module.exports = {

    registerRoutes: function(app,checkAuth) {
        app.get('/pembelian/daftartransaksi',checkAuth,this.daftarTransaksiPembelian);
        app.get('/pembelian/konfirmasipembayaran',checkAuth,this.getListKonfirmasiPembayaran);
        app.post('/pembelian/konfirmasipembayaran/post',checkAuth,this.postKonfirmasiPembayaran);
        app.get('/pembelian/konfirmasipembayaran/sukses',this.konfirmasiPembayaranSukses);        
        app.post('/pembelian/konfirmasipembayaran/sukses/post',this.postKonfirmasiPembayaranSukses);
        app.get('/pembelian/konfirmasipenerimaan',checkAuth,this.konfirmasiPenerimaan);
        app.get('/pembelian/statuspemesanan',checkAuth,this.statusPemesanan);
        app.get('/pembelian/diterima/:invoiceId',checkAuth,this.pembelianDiterima);
    },

    pembelianDiterima : function(req, res, next){
        models.Invoice.update({
            status_tampil : statusTampil.pesananDiterima
        },{
            where: { id : req.params.invoiceId }
        }).then(function() {
            var now = moment();
            models.Invoice_Status.create({
                invoiceId : req.params.invoiceId,
                statusId : statusTampil.pesananDiterima,
                waktu : moment(now).format('YYYY-MM-DD HH:mm')
            }).then(function() {
                res.redirect('/pembelian/statuspemesanan');
            })
        });
    },
    daftarTransaksiPembelian : function(req, res, next){
        models.Invoice.findAll({
            where : {
                pembeliId : res.locals.session.penggunaId,
                status_tampil : {$not : statusTampil.logTransaksiDihapus}
            },
            include: [
                models.Pengguna,models.Toko,models.Produk,
                { model:models.Status,order : ['waktu']},
                {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(invoice){
            //res.send(Invoice);
            res.render('pc-view/pembelian/daftarTransaksiPembelian', {
                tabMenu: 'Daftar Transaksi Pembelian',
                moment : moment,
                Invoice :  invoice
            })
        });
    },
    postKonfirmasiPembayaran : function(req, res, next){
        var now = moment();
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields){
            //tidak apa-apa diupload dengan nama file gambar yang sama
            models.Invoice.update({
                jatuh_tempo : moment(now).add(3,'days'),//jatuh tempo
                tanggal_pembayaran : fields.tanggal_pembayaran,
                no_rekening : fields.no_rekening,
                nama_pemilik_rekening : fields.nama_pemilik_rekening,
                bankId : fields.bankId,
                gambar_bukti_pembayaran : fields.gambar_bukti_pembayaran,
                status_tampil : statusTampil.sudahKonfirmasiPembayaran
            },{
                where: { id : fields.invoiceId }
            }).then(function() {
                var now = moment();
                models.Invoice_Status.create({
                    invoiceId : fields.invoiceId,
                    statusId : statusTampil.sudahKonfirmasiPembayaran,
                    waktu : moment(now).format('YYYY-MM-DD HH:mm')
                }).then(function() {
                    req.session.total_harga = fields.total_harga;
                    res.redirect('/pembelian/konfirmasipembayaran/sukses');
                })
            });
        });
    },
    daftarPembelian : function(req, res, next){        
        res.render('pc-view/pembelian/daftarPembelian', {
            tabMenu: 'Daftar Invoice Pembelian',
        });
    },
    postKonfirmasiPembayaranSukses : function(req, res, next){
        delete req.session.total_harga;
        res.redirect('/pembelian/statuspemesanan');
    },
    konfirmasiPembayaranSukses : function(req, res, next){
        res.render('pc-view/pembelian/konfirmasiPembayaranSukses', {
            total_harga : req.session.total_harga
        });
    },
    //TODO: masih eror konfirmasi pembayaran
    getListKonfirmasiPembayaran : function(req, res, next){
        models.Invoice.findAll({
            where : {
                pembeliId : res.locals.session.penggunaId,
                status_tampil : statusTampil.sudahCekOutOrder
            },
            include: [
                models.Pengguna,models.Toko,models.Produk,
                { model : models.Penerima, include :[
                    models.Provinsi,models.Kabupaten
                ]
                }]
        }).then(function(Invoice) {
            models.Bank.findAll().then(
                function(bank) {
                    res.render('pc-view/pembelian/konfirmasiPembayaran', {
                        tabMenu: 'Konfirmasi Pembayaran',
                        daftarInvoice : Invoice,
                        daftarBank : bank,
                        moment : moment
                    });
            });
        })
    },

    konfirmasiPenerimaan : function(req, res, next){
        res.render('pc-view/pembelian/konfirmasiPenerimaan', {
            tabMenu: 'Konfirmasi Penerimaan',
        });
    },

    statusPemesanan: function(req, res, next){
        models.Invoice.findAll({
            where : {
                //testing seolah ini pengguna dengan userid 2, kalau sudah fix dikembalikan lagi berdasarkan session
                // pembeliId : 1,
                pembeliId : res.locals.session.penggunaId,
                status_tampil : {$lt: statusTampil.logTransaksiDihapus }// status_tampil < 7
            },
            include: [
                    models.Pengguna,models.Toko,models.Produk,
                    {model:models.Status,order : ['waktu']},
                    {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
            ]
        }).then(function(Invoice){
            res.render('pc-view/pembelian/statusPemesanan', {
                tabMenu: 'Status Pemesanan',
                moment : moment,
                Invoice : Invoice
            })
        });
    },
};
