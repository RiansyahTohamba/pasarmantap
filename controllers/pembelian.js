/**
 * Created by riansyahPC on 11/23/2015.
 */
var models  = require('../models');
module.exports = {

    registerRoutes: function(app) {
        app.get('/pembelian/daftarpembelian',this.daftarPembelian);
        app.get('/pembelian/konfirmasipembayaran',this.konfirmasiPembayaran);
        app.get('/pembelian/konfirmasipenerimaan',this.konfirmasiPenerimaan);
        app.get('/pembelian/statuspemesanan',this.statusPemesanan);
    },

    daftarPembelian : function(req, res, next){
        res.render('pengguna/pembelian/daftarPembelian', {
            tabMenu: 'Daftar Transaksi Pembelian',
        });
    },

    konfirmasiPembayaran : function(req, res, next){
        res.render('pengguna/pembelian/konfirmasiPembayaran', {
            tabMenu: 'Konfirmasi Pembayaran',
        });
    },

    konfirmasiPenerimaan : function(req, res, next){
        res.render('pengguna/pembelian/konfirmasiPenerimaan', {
            tabMenu: 'Konfirmasi Penerimaan',
        });
    },

    statusPemesanan: function(req, res, next){
        res.render('pengguna/pembelian/statusPemesanan', {
            tabMenu: 'Status Pemesanan',
        });
    },
};
