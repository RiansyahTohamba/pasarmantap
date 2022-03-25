/**
 * Created by riansyahPC on 11/29/2015.
 */
var models  = require('../models');
var async  = require('async');
//method post dari halaman beliProduk.jade ke keranjang belanja
var credentials = require('../api/credentials.js');
var ongkir = require('../api/rajaOngkir')({
    key: credentials.rajaOngkir.key
});
var statusTampil = require('../statusTampil');

//dari url app.post('/keranjang/tambah', cart.tambahCart);
exports.tambahCart = function(req, res, next) {
    var cart = req.session.cart || (req.session.cart = []);
    var isSameInvoice = 0; //jika nilainya 0 berarti membuat invoice baru
    for(var val in cart){
        if(
            req.body.tokoId == cart[val].Toko[0].id &&
            req.body.penerimaId == cart[val].Penerima[0].id
        ){
            var totalHarga = parseInt(req.body.jumlah) * parseInt(req.body.hargaProduk);
            var totalBerat = parseInt(req.body.jumlah) * parseInt(req.body.beratProduk);
            cart[val].Produk.push({
                id: req.body.produkId, jumlah : req.body.jumlah || 0,
                beratProduk : req.body.beratProduk || 0,
                totalHarga : totalHarga,
                totalBerat : totalBerat,
                nama : req.body.namaProduk,
                harga : req.body.hargaProduk,
                gambar : req.body.gambarProduk
            });
            isSameInvoice = 1;
            //jika eror:masalah internet yang terlalu lama jadi keburu diredirect sebelum beres

            var totalBeratPerTagihan = 0;
            for(var valPro in cart[val].Produk){
                totalBeratPerTagihan = totalBeratPerTagihan + cart[val].Produk[valPro].totalBerat;
            }
            //ongkir.getOngkosKirim(
            ongkir.getOngkosKirimOffline(
                //idKotaAsalToko,idKotaPenerima,berat,
                cart[val].Toko[0].idKotaAsalToko,
                cart[val].Penerima[0].Kabupaten[0].id,
                totalBeratPerTagihan,
                function(ongkosKirim){
                    //masalahnya ongkoskirimnya masih object, disini
                    cart[val].ongkosKirim = ''+ongkosKirim;
                    //console.error(val+' - '+cart[val].ongkosKirim);
                    console.error('---- dalam 1 invoice ada banyak produk----');
                    console.error(JSON.stringify(cart));
                    res.redirect('/keranjang');
                }
            );
        }
    }
    //membuat invoice baru
    if(isSameInvoice == 0){
        var totalHarga = parseInt(req.body.jumlah) * parseInt(req.body.hargaProduk);
        var totalBerat = parseInt(req.body.jumlah) * parseInt(req.body.beratProduk);

        cart.push({
            id : Date.now(),
            Produk : [
                {id: req.body.produkId, jumlah : req.body.jumlah || 0,
                    beratProduk : req.body.beratProduk || 0,
                    totalBerat : totalBerat,
                    totalHarga : totalHarga,
                    nama : req.body.namaProduk,
                    harga : req.body.hargaProduk,
                    gambar : req.body.gambarProduk
                }
            ],
            Toko : [{
                id : req.body.tokoId, nama : req.body.namaToko,
                idKotaAsalToko : req.body.idKotaAsalToko
            }],
            Penerima :[{
                id : req.body.penerimaId, nama : req.body.namaPenerima,
                alamat : req.body.alamat, kecamatan : req.body.kecamatan,
                Provinsi : [{id : req.body.idProvinsi ,nama : req.body.namaProvinsi }],
                Kabupaten : [{id : req.body.idKabupaten ,nama : req.body.namaKabupaten,
                    kodePos :  req.body.kodePos}],
                telepon : req.body.telepon
            }],
            keterangan : req.body.keterangan || '-',
            //nilai akhir subtotal jika ada pertambahan produk lagi
            ongkosKirim : req.body.ongkosKirim || 0,
            totalPerTagihan : 0,
            nilaiSubTotal : 0
        });
        console.error('---- buat invoice baru ----');
        console.error(JSON.stringify(cart));
        res.redirect('/keranjang');
    }

};


exports.hapusSemuaProdukCart = function(req, res, next) {
    delete req.session.cart;
    res.redirect('/keranjang/');
};
exports.hapusSemuaPertagihan = function(req, res, next) {
    var cart =  req.session.cart;
    for(var val in cart){
        if(cart[val].id == req.params.cartId){
            cart.splice(val,(val+1) );
        }
    }
    res.redirect('/keranjang/');
};
exports.hapusSatuProdukCart = function(req, res, next) {
    var cart =  req.session.cart;
    for(var val in cart){
        for(var valPro in cart[val].Produk){
            if(req.params.produkId == cart[val].Produk[valPro].id){
                if(cart[val].Produk.length == 1){
                    cart.splice(val,(val+1) );
                }else{
                    cart[val].Produk.splice(valPro,(valPro+1));
                }
            }
        }
    }
    res.redirect('/keranjang/');
};

exports.getCart1 = function(req, res, next) {
    var cart = req.session.cart || (req.session.cart = []);
    var html = JSON.stringify(cart)+"<br> <a href='/produk/daftarbykategori/1'>belanja lagi</a>";
    res.send(html);
};

//dari url : app.get('/keranjang/', cart.getCart);
exports.getCart = function(req, res, next) {
    var totalPembelian = 0;
    var totalPerTagihan = [];
    var totalBeratPerTagihan = [];

    var cart = req.session.cart || (req.session.cart = []);
    //untuk pengujian lepas komentar dibawah ini, lalu var cart diatas
    //var cart = [];
    //cart.push({"id":1455937532273,"Produk":[{"id":"1","jumlah":"10","beratProduk":"100","totalBerat":1000,"totalHarga":135000,"nama":"naruto","harga":"13500","gambar":"naruto.jpg"},{"id":"2","jumlah":"100","beratProduk":"100","totalHarga":1350000,"totalBerat":10000,"nama":"naruto 1 - 20","harga":"13500","gambar":"narutos.jpg"}],"Toko":[{"id":"1","nama":"barokah","idKotaAsalToko":"44"}],"Penerima":[{"id":"1","nama":"Riansyah","alamat":"Jln Anawai No 44","kecamatan":"wua-wua","Provinsi":[{"id":"1","nama":"Bali"}],"Kabupaten":[{"id":"2","nama":"Aceh Barat Daya","kodePos":"23764"}],"telepon":"039393939312"}],"keterangan":"-","ongkosKirim":"20000","totalPerTagihan":0,"nilaiSubTotal":0},{"id":1455937559303,"Produk":[{"id":"18","jumlah":"5","beratProduk":"400","totalBerat":2000,"totalHarga":100000000,"nama":"iphone 7","harga":"20000000","gambar":"iphone3.png"}],"Toko":[{"id":"2","nama":"jaya","idKotaAsalToko":"1"}],"Penerima":[{"id":"1","nama":"Riansyah","alamat":"Jln Anawai No 44","kecamatan":"wua-wua","Provinsi":[{"id":"1","nama":"Bali"}],"Kabupaten":[{"id":"2","nama":"Aceh Barat Daya","kodePos":"23764"}],"telepon":"039393939312"}],"keterangan":"-","ongkosKirim":"20000","totalPerTagihan":0,"nilaiSubTotal":0})
    //req.session.cart = cart;

    for(var val in cart){
        var cartArr = cart[val];
        totalPerTagihan[val] = 0;
        totalBeratPerTagihan[val] = 0;
        for(var valPro in cartArr.Produk){
            var produkDalamTagihan = cartArr.Produk;
            totalPerTagihan[val] = totalPerTagihan[val] +
                parseInt( produkDalamTagihan[valPro].totalHarga );
            totalBeratPerTagihan[val] = totalBeratPerTagihan[val] +
                parseInt( produkDalamTagihan[valPro].totalBerat );
            if(valPro == (produkDalamTagihan.length - 1) ){
                totalPerTagihan[val] = totalPerTagihan[val]+
                    parseInt(cartArr.ongkosKirim);
            }
        }
        totalPembelian = totalPembelian + totalPerTagihan[val];
    }

    res.render('pc-view/pembelian/keranjangBelanja', {
        totalBeratPerTagihan : totalBeratPerTagihan,
        totalPerTagihan : totalPerTagihan,
        total_pembelian : totalPembelian,
        cart : cart
    });
};
//dari url : app.post('/keranjang/konfirmasi', cart.konfirmasiPembelian);
exports.konfirmasiPembelian = function(req, res, next){
    res.render('pc-view/pembelian/konfirmasiPembelian', {
        total_pembelian : req.session.total_pembelian
    });
};
//todo: buat 1 transaksi sama 1 invoice
//dari url : app.post('/keranjang/simpan', cart.insertCartToInvoice);
exports.insertCartToInvoice = function(req, res, next) {
    var moment = require("moment");
    var now = moment();
    var jatuh_tempo = moment(now).add(3,'days');
    var cart = req.session.cart;
    var sql = '';
    var tokoArr = req.body.tokoId;
    var totalPerTagihan = req.body.totalPerTagihan;
    var totalBeratPerTagihan = req.body.totalBeratPerTagihan;

    for (var countCart in cart) {
        var invoiceKode = 'INV/'+Date.now()+'/'+Math.floor(Math.random() * 10000) ;
        var invoiceId = invoiceKode.replace(/[/]/g,"");
        models.Invoice.create({
            id : invoiceId,
            kode : invoiceKode,
            tanggal : moment(now).format('YYYY-MM-DD'),
            jatuh_tempo : moment(jatuh_tempo).format('YYYY-MM-DD'),
            total_pembelian : req.body.total_pembelian,//eror disini, jika ada 2 pembelian toko
            status_tampil : statusTampil.sudahCekOutOrder,
            pembeliId : res.locals.session.penggunaId,
            TokoId : tokoArr[countCart],
            //todo-eror : total berat dan total harga jika ada 2 invoice jadi bagus, jika cuman 1 invoice,cuman diambil 1 digit
            PenerimaId : cart[countCart].Penerima[0].id,
            total_berat : (cart.length > 1) ? totalBeratPerTagihan[countCart] : totalBeratPerTagihan ,
            ongkos_kirim : cart[countCart].ongkosKirim,
            total_harga : (cart.length > 1) ? totalPerTagihan[countCart] : totalPerTagihan,
            keterangan : cart[countCart].keterangan,
        }).then(function(invoice){
            models.Invoice_Status.create({
                invoiceId : invoice.id,
                statusId : statusTampil.sudahCekOutOrder,
                waktu : moment(now).format('YYYY-MM-DD HH:mm')
            })
        })
        var cartProduk = cart[countCart].Produk
        for(var countPro in cartProduk){
            sql = sql + "INSERT INTO invoice_produks " +
                "(invoiceId,produkId,jumlah_produk)"+
                "VALUES('"+invoiceId+"',"+cartProduk[countPro].id+","
                +cartProduk[countPro].jumlah+");";
        }
    }
    models.sequelize.query(sql)
        .then(function(){
            req.session.total_pembelian = req.body.total_pembelian;
            delete req.session.cart;
            res.redirect('/keranjang/konfirmasi');
        });
};
