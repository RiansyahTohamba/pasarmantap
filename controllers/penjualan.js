/**
 * Created by riansyahPC on 11/23/2015.
 */
var models  = require('../models');
module.exports = {

    registerRoutes: function(app,checkAuth) {
        app.get('/penjualan/daftarpenjualan',checkAuth,this.daftarPenjualan);
        app.get('/penjualan/pesananbaru',checkAuth,this.pesananBaru);
        app.get('/penjualan/konfirmasipengiriman',checkAuth,this.konfirmasiPengiriman);
        app.get('/penjualan/statuspengiriman',checkAuth,this.statusPengiriman);
    },

    daftarPenjualan : function(req, res, next){
        res.render('pengguna/penjualan/daftarPenjualan', {
            tabMenu: 'Daftar Transaksi Penjualan',
        });
    },

    pesananBaru : function(req, res, next){
        res.render('pengguna/penjualan/pesananBaru', {
            tabMenu: 'Pesanan Baru',
        });
    },

    konfirmasiPengiriman : function(req, res, next){
        res.render('pengguna/penjualan/konfirmasiPengiriman', {
            tabMenu: 'Konfirmasi Pengiriman',
        });
    },

    statusPengiriman: function(req, res, next){
        res.render('pengguna/penjualan/statusPengiriman', {
            tabMenu: 'Status Pengiriman',
        });
    },
};
