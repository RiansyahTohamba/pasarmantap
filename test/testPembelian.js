/**
 * Created by riansyah on 4/21/2016.
 */
var models = require('../models');
var async = require('async');
var moment = require('moment');

//daftarTransaksiPembayaran();
//daftarKonfirmasiPembayaran();
//newInsertCartToInvoice()
//latihanIterasi()
//bersihkanTransaksi();
//daftarTransaksiPenjualan();

function daftarTransaksiPenjualan(){
    models.Invoice.findAll({
        where : {
            //pembeliId : res.locals.session.penggunaId,
            //testing seolah ini pengguna dengan userid 2, kalau sudah fix dikembalikan lagi berdasarkan session
            pembeliId : 2,
            status_tampil : 1
        },
        include: [
            models.Pengguna,models.Toko,models.Produk,
            { model:models.Status,order : ['waktu']},
            {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
        ]
    }).then(function(invoice){
        console.error(invoice)
    })
}
//var n = 0;
//(n == 0 ) ? console.log('benar') : console.log('salah')
//console.log(moment(Date.now()).format('YYYY-MM-DD HH:mm'));
function bersihkanTransaksi(){
    models.Invoice_Produk.destroy({
            where : {}
        }).then(function(){
            models.Invoice.destroy({ where : {}
        }).then(function(){
            models.Invoice_Status.destroy({
                where : {}
        }).then(function(){
                console.log('end');
            });
        });
    })
}

function newInsertCartToInvoice(){
    var moment = require("moment");
    var now = moment();
    var jatuh_tempo = moment(now).add(3,'days');
    //versi testing
    //hilangkan stringnya
    var cart = [
        {
            id:1461540439887,
            Produk:[{
                id:2,jumlah:12,beratProduk:100,totalBerat:1200,
                totalHarga:162000,nama:'naruto 1 - 20',harga:13500,
                gambar:'narutos.jpg'}
            ],
            Toko:[{id:1,nama:'barokah',idKotaAsalToko:44}],
            Penerima:[{id:1,nama:'Riansyah',alamat:'Jln Anawai No 44',
            kecamatan:'wua-wua',Provinsi:[{id:1,nama:'Bali'}],
            Kabupaten:[{id:2,nama:'Aceh Barat Daya',kodePos:23764}],
            telepon:'039393939312'}],keterangan:'-',ongkosKirim:5000,
            totalPerTagihan:0,nilaiSubTotal:0},
        {
            id:1461540442153,
            Produk:[{
                id:31,jumlah:1,beratProduk:400,totalBerat:400,
                totalHarga:190000,nama:'buku-2',harga:190000,
                gambar:'buku-2.jpg'
            }],
            Toko:[{id:1,nama:'barokah',idKotaAsalToko:44}],
            Penerima:[{id:1,nama:'Riansyah',alamat:'Jln Anawai No 44',
                kecamatan:'wua-wua',Provinsi:[{id:1,nama:'Bali'}],
                Kabupaten:[{id:2,nama:'Aceh Barat Daya',kodePos:23764}],
                telepon:'039393939312'}],keterangan:'-',ongkosKirim:5000,
            totalPerTagihan:0,nilaiSubTotal:0
    }];
    var sql = '';
    //res.send(cart);
    models.Transaksi.create({
        pembeliId : 1,
        tokoId : 1,
        status_tampil : 1,
        tanggal : moment(now).format('YYYY-MM-DD'),
        jatuh_tempo : moment(jatuh_tempo).format('YYYY-MM-DD'),
        total_pembelian : 1000000
    }).then(function(transaksi){
        var totalPerTagihan = 10000000;
        var totalBeratPerTagihan = 10000000000;
        var date = new Date();
        //todo: eror disini jika ada dua invoice
        for(var val in cart){
            var idInvoice = 'INV/'+Date.now()+'/'+Math.floor(Math.random() * 10000);
            sql = sql +  "INSERT INTO invoices " +
                "(id ,transaksiId ,tokoId ," +
                "penerimaId,total_berat,ongkos_kirim," +
                "total_harga,keterangan)"+
                "VALUES "+
                "( '"+idInvoice+"', "+transaksi.id+","+cart[val].Toko[0].id+"," +
                ""+cart[val].Penerima[0].id+","+totalBeratPerTagihan[val]+", " +
                ""+cart[val].ongkosKirim+","+
                    //""+totalPerTagihan[val]+", '"+cart[val].keterangan+"');";
                    //cuman digit pertama saja yang diambil karena dianggap array
                ""+totalPerTagihan+", '"+cart[val].keterangan+"');";
            for(var valPro in cart[val].Produk){
                var arrProduk = cart[val].Produk;
                sql = sql + "INSERT INTO invoice_produks " +
                    "(invoiceId,produkId,jumlah_produk)"+
                    "VALUES('"+idInvoice+"',"+arrProduk[valPro].id+","
                    +arrProduk[valPro].jumlah+");";
            }
        }

    }).then(function(){
        //res.send(sql);
        models.sequelize.query(sql)
            .then(function(){
                res.console('redirect /keranjang/konfirmasi');
            });
    });
}

//insertCartToInvoice()
function insertCartToInvoice(){
    var moment = require("moment");
    var now = moment();
    var jatuh_tempo = moment(now).add(3,'days');
    var cart = [];
    cart.push({
        id : 11,
        Produk : [
            {id: 1, jumlah : 10,
                totalHargaBarang : 200,
                harga : 20
            },
            {id: 18, jumlah : 100,
                totalHargaBarang : 200,
                harga : 20
            }
        ],
        total_berat : 20,
        Toko : [{id : 1}],
        Penerima :[{id : 11}],
        ongkosKirim : 10,
        keterangan : ''
    });
    cart.push({
        id : 111,
        Produk : [
            {id: 2, jumlah : 10,
                totalHargaBarang : 200,
                harga : 20
            }
        ],
        total_berat : 10,
        Toko : [{id : 1}],
        Penerima :[{id : 11}],
        ongkosKirim : 10,
        keterangan : ''
    });
    models.Transaksi.create({
        PenggunaId : 1,
        tanggal : moment(now).format('YYYY-MM-DD'),
        jatuh_tempo : moment(jatuh_tempo).format('YYYY-MM-DD'),
        //total tagihan didapatkan dari form req.body.totalPembayaran
        total_tagihan : 1000000
    }).then(function(transaksi){
        //total per satu tagihan didapatkan dari array form req.body.req.body.totalPerTagihan
        var totalPerTagihan = [100,1000];
        var date = new Date();
        var sql = '';
        for(var val in cart){
            //raw query
            var idInvoice = 'INV/'+Date.now()+'/'+date.getMilliseconds();
            sql = sql +  "INSERT INTO invoices " +
                "(id ,transaksiId ,tokoId ," +
                "penerimaId,total_berat," +
                "total_harga,keterangan)"+
                "VALUES "+
                "( '"+idInvoice+"', "+transaksi.id+","+cart[val].Toko[0].id+"," +
                ""+cart[val].Penerima[0].id+","+cart[val].total_berat+", " +
                ""+totalPerTagihan+", '"+cart[val].keterangan+"');";

            for(var valPro in cart[val].Produk){
                var arrProduk = cart[val].Produk;

                sql = sql + "INSERT INTO invoice_produks " +
                    "(invoiceId,produkId,jumlah_produk)"+
                    "VALUES('"+idInvoice+"',"+arrProduk[valPro].id+","
                    +arrProduk[valPro].jumlah+");";
                if( val == (cart.length-1) && valPro == (arrProduk.length-1) ){
                    console.log(sql);
                    models.sequelize.query(sql)
                        .then(function(){
                            console.log('test selesai')
                        });
                }
            }
        }
    });

}

function latihanIterasi(){
    var cart = [];
    cart.push({
        tokoId : 111,
        Produk : [
            {id: 1111, jumlah : 10,
                totalHargaBarang : 200,
                harga : 20
            },
            {id: 1112, jumlah : 100,
                totalHargaBarang : 200,
                harga : 20
            }
        ]
    });
    cart.push({
        tokoId : 222,
        Produk : [
            {id: 2221, jumlah : 10,
                totalHargaBarang : 200,
                harga : 20
            }
        ]
    });
    //var produk = ['buku1','rian1.5','rian2'];
    var sql = '';
    for (var countCart= 0; countCart < cart.length; ++countCart) {
        var invoiceId ='INV/'+Date.now()+'/'+Math.floor(Math.random() * 10000);
        models.Invoice.create({
            id: invoiceId,
            TokoId : cart[countCart].tokoId,
            PenerimaId : 1,
        })
        var arrProduk = cart[countCart].Produk;
        for(var countPro in arrProduk) {

            sql = sql + "INSERT INTO invoice_produks " +
                "(invoiceId,produkId,jumlah_produk)"+
                "VALUES('"+invoiceId+","+arrProduk[countPro].id+");";
        }
    }
    console.error(sql)
    //(function iterator(count){
    //    if(count >= cart.length){
    //        callback(null,null);
    //        //return;
    //    }
    //    console.log(cart[count])
    //    iterator(count + 1);
    //})(0)
}
function daftarKonfirmasiPembayaran(){
    //Invoice yang ditampilkan hanya status_tampil = 1
    //jika Invoice telah dibatalkan,maka status_tampil = 0
    //jika Invoice telah berhasil(usai),maka status_tampil = 2
    models.Invoice.findAll({
        where : {
            pembeliId : 1,
            status_tampil : 1
        },
        include: [ models.Pengguna,models.Toko,models.Produk,
            { model : models.Penerima, include :[
                models.Provinsi,models.Kabupaten
            ]
            }]
    }).then(function(invoice) {
        console.log(invoice[0].Produks);
        //console.log(transaksi[0].Invoices[0].Produks[0].Invoice_Produk.jumlah_produk);
    })
}
function daftarTransaksiPembayaran(){
    models.Transaksi.findAll({
        where : {
            //pembeliId : res.locals.session.penggunaId,
            //testing seolah ini pengguna dengan userid 2, kalau sudah fix dikembalikan lagi berdasarkan session
            pembeliId : 1,
            status_tampil : 1
        },
        include: [models.Pengguna,
            {
                //todo: order sesuai tanggal status
                model: models.Invoice, include:
                [
                    { model:models.Status,order : ['waktu']}
                    ,models.Toko,models.Produk,
                    {model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
                ]
            }
        ]
    }).then(function(transaksi){
        //kosong makanya tidak ada datavalues
        if(transaksi)
            console.log(transaksi[0].dataValues);
        else console.log('kosong')
    });
}
