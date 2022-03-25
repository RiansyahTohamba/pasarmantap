/**
 * Created by riansyahPC on 1/4/2016.
 */
var sequelize = require("sequelize");
var models = require('../models');
var async = require('async');
var credentials = require('../api/credentials.js');
var moment = require("moment");
var ongkir = require('../api/rajaOngkir')({
    key: credentials.rajaOngkir.key
});
//var test ='1' ;
//(test) ? console.log('benar') : console.log('salah')

exports.test = function (test) {
    //insertBanyakProduk(test);
    //login(test);
    //daftarProdukAjax(test);
    //getRekomendasiToko(test);
    //detailProduk(test);
    //jumlahTerjual(test)
    //produkMilikToko(test)
    //profilToko(test);
    //getPenerima(test);
    //daftarProduk(test);
    //kategoriProdukMilikToko(test);
    //beliPrroduk(test);
    //getToko(test);
    //getOngkir(test);
    //pengaturanToko(test);
    //deleteCart(test);
    //insertCart(test);
    //insertCartToInvoice(test);
    //konfirmasiPembayaran(test);
    //hotlist(test);
    //statusPemesanan(test);
    //produkMilikTokoTerjual(test);
    //pesananBaru(test);
};
//updateBanyakProduk();
function updateBanyakProduk(){
    for(var n=1;n<=10;n++) {
        console.log('tahapan ' + n);
        models.Produk.update({gambar : 'blazer-' + n+'.jpg'},{
            where: {nama: 'blazer-' + n}
        });
        //models.Produk.update({KategoriProdukId : 11},{
        //    where: {nama: 'mac-' + n}
        //});
    }
}
function insertBanyakProduk(){
    for(var n=1;n<=10;n++){
        console.log('tahapan '+n);
        models.Produk.create({
           nama : 'lenovo-'+n,
           harga : 3900000,
           berat : 400,
           gambar : 'hplenovo-'+n+'.jpg',
           kondisi : 1,
           deskripsi : 'hp yang bagus',
           KategoriProdukId : 12,
           EtalaseId : 0,
           TokoId : 1
        });
        //models.Produk.create({
        //   nama : 'baju-'+n,
        //   harga : 550000,
        //   berat : 700,
        //   gambar : 'baju-'+n+'.jpg',
        //   kondisi : 1,
        //   deskripsi : 'blazer yang bagus',
        //   KategoriProdukId : 1,
        //   EtalaseId : 0,
        //   TokoId : 2
        //});
        //models.Produk.create({
        //   nama : 'buku-'+n,
        //   harga : 190000,
        //   berat : 400,
        //   gambar : 'buku-'+n+'.jpg',
        //   kondisi : 1,
        //   deskripsi : 'hp yang bagus',
        //   KategoriProdukId : 2,
        //   EtalaseId : 0,
        //   TokoId : 2
        //});
        //models.Produk.create({
        //   nama : 'iphone-'+n,
        //   harga : 13900000,
        //   berat : 400,
        //   gambar : 'iphone-'+n+'.jpg',
        //   kondisi : 1,
        //   deskripsi : 'hp yang bagus',
        //   KategoriProdukId : 12,
        //   EtalaseId : 0,
        //   TokoId : 3
        //});
        //models.Produk.create({
        //   nama : 'mac-'+n,
        //   harga : 21000000,
        //   berat : 400,
        //   gambar : 'mac-'+n+'.jpg',
        //   kondisi : 1,
        //   deskripsi : 'hp yang bagus',
        //   KategoriProdukId : 12,
        //   EtalaseId : 0,
        //   TokoId : 3
        //});
        //models.Produk.create({
        //   nama : 'sepatu-'+n,
        //   harga : 4900000,
        //   berat : 400,
        //   gambar : 'sepatu-'+n+'.jpg',
        //   kondisi : 1,
        //   deskripsi : 'hp yang bagus',
        //   KategoriProdukId : 12,
        //   EtalaseId : 0,
        //   TokoId : 4
        //});
    }
}
function daftarProdukAjax(test){
    models.Produk.findAll({
        offset: 0, limit: 5
    }).then(function(listProduk) {
        var produkHTML = [];
        for(var val in listProduk){
            produkHTML[val] = "<td>" +
                listProduk[val].nama+"</td>";
        }
        produkHTML = "<tr>"+produkHTML+"</tr>";
        console.log(produkHTML);
        test.done();
    });
}
function login(test){
    models.Pengguna.find({
        attributes: ['nama'],
        where : {
            $and : [ { sandi : 'biji'}, { email : 'rian@yahoo.com' } ]
        },
        include : models.Toko
    }).then(function(pengguna) {
       console.log(pengguna.nama);
       console.log(pengguna.Toko.nama);
       test.done();
    });
}
//todo:status nomor 2 berarti lagi diverifikasi pembayarannya
//status nomor 3 penjual telah mengkonfirmasi pesanan yang dilakukan
//tangkap dulu status tiap  invoice_statuses lalu cek nomornya
function pesananBaru(test){
    models.Transaksi.findAll({
        where : {
            penjualId : 1,
            status_tampil : 1
        },
        include: [models.Pengguna,
            {
                model: models.Invoice, include:
                [
                    models.Toko,
                    { model:models.Status,where : {id : 3 }},
                    { model : models.Penerima, include :[models.Provinsi,models.Kabupaten]}
                ]
            }
        ]
    }).then(function(transaksi){
        //var indexInvoice = transaksi.Invoices[0].Statuses.length;
        //console.log(transaksi.Invoices[0].Statuses[indexInvoice-1].id);
        //console.log(transaksi.Invoices[0].Statuses[0].pesan);
        for(indexTrans in transaksi){
            //invoice yang sama dicetak 2 kali, karena banyak status tiap invoice
            for(indexInv in transaksi[indexTrans].Invoices){
                var invoice = transaksi[indexTrans].Invoices[indexInv];
                //var indexInvoice = invoice.Statuses.length;
                console.log(invoice.id);
                for(indexStatus in transaksi[indexTrans].Invoices[indexInv].Statuses){
                    var status = transaksi[indexTrans].Invoices[indexInv].Statuses[indexStatus];
                    console.log(status.pesan);
                }
            }
        }
        test.done();
    });
}
//todo :selesaikan rekomendasi toko
//getRekomendasiToko();
function getRekomendasiToko(test){
    models.Invoice_Produk.findAll({
        attributes : ['Produk.nama','Produk.harga','Produk.gambar'],
        limit : '3',
        include : models.Produk,
        group : 'produkId',
        order : [ [sequelize.fn('sum',sequelize.col('jumlah_produk')),'DESC'] ]
    }).then(function(produkTerlaris) {
        //mengambil wish list
        models.Wishlist.findAll({
            include : models.Produk
        }).then(function(wishList) {
            //mengambil toko favorit
            models.Toko_Favorit.findAll({
                include : models.Toko
            }).then(function(tokoFavorit) {
                //pc-view id diganti sesuai sesi
                //mengambil produk rekomendasi toko favorit
                //harus disusun dari tabel child hingga ke parrentnya
                models.Produk.findAll({
                    include : [
                        { model: models.Toko,
                            include : [{model : models.Toko_Favorit,where : {PenggunaId : 1},required : false }]
                        }]
                    //attributes : ['Toko.Etalases.Produks.nama'],
                }).then(function(rekomendasi) {
                    models.Kategori_Produk.findAll({
                        attributes : {exclude :['deskripsi']}
                    }).then(function(kategori_produk) {
                        //console.error(kategori_produk);
                        console.error(produkTerlaris);
                        console.error(rekomendasi);
                        console.error(tokoFavorit);
                        console.error(wishList);
                    })
                })
            })
        })
    })
}
//produkMilikTokoTerjual();
function produkMilikTokoTerjual(){
    //sequelize.fn(SUM, sequelize.col(action.count), sequelize.literal(*), sequelize(action.actionType.value) ), score
    models.Invoice_Produk.find({
        attributes : [[sequelize.fn('SUM',sequelize.col('jumlah_produk') ),'jumlah_produk'] ]  ,
        include: [
            { model: models.Produk,where : {tokoId :1}
            }
        ]
    }).then(function(jumlah) {
        console.log(jumlah.jumlah_produk);
        //tidak pakai grunt
        //test.done();
    })
}
function statusPemesanan(test){
    models.Transaksi.find({
        where : {
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
        //var indexInvoice = transaksi.Invoices[0].Statuses.length;
        //console.log(transaksi.Invoices[0].Statuses[indexInvoice-1].pesan);
        //console.log(transaksi.Invoices[0].Statuses[0].pesan);
        for(indexTrans in transaksi){
            //console.log(transaksi[indexTrans].id);
            for(indexInv in transaksi[indexTrans].Invoices){
                var invoice = transaksi[indexTrans].Invoices[indexInv];
                console.log(invoice.id);
                //for(indexPro in invoice.Produks){
                //    var produk = invoice.Produks[indexPro];
                //    console.log(indexPro+ - +produk.nama);
                //}
            }
        }

        test.done();
    });
}

function hotlist(test){
    models.Invoice_Produk.findAll({
        attributes : [Produk.nama,Produk.harga,Produk.gambar],
        limit : 3,
        include : models.Produk,
        group : produkId,
        order : [ [sequelize.fn(sum,sequelize.col(jumlah_produk)),DESC] ]
    }).then(function(produk) {
        console.log(produk);
        test.done();
    })
}
function konfirmasiPembayaran(test){
    models.Transaksi.findAll({
        where : { PenggunaId : 1 },
        include: [
            {
                model: models.Invoice, include:
                [models.Toko,models.Produk,{
                    model : models.Penerima, include :[
                        models.Provinsi,models.Kabupaten
                    ]
                }]
            }
        ]
    }).then(function(transaksi){
       console.log(transaksi[0].Invoices[0].Produk);
       test.done()
    });
}
function postCartToInvoice(test){
    var cart = [];
    cart.push({
        produkId : 2,
        penerimaId : 1,
        keterangan : '',
        jumlah : 20,
        nilaiSubTotal : 100040
    });
    cart.push({
        produkId : 1,
        penerimaId : 1,
        keterangan : '',
        jumlah : 10,
        nilaiSubTotal : 100000
    });

    var stack = {};
    var now = moment();
    var jatuh_tempo = moment(now).add(3,days);
        models.Transaksi.create({
            PenggunaId : 1,
            tanggal : moment(now).format(YYYY-MM-DD),
            jatuh_tempo : moment(jatuh_tempo).format(YYYY-MM-DD),
            total_tagihan : 100000000
        }).then(
            function(transaksi){
                for(val in cart){
                    models.Invoice.create({
                        ProdukId : cart[val].produkId,
                        //TODO:cara mengambil nilai transaksi yang telah dipost sebelumnya?
                        TransaksiId : transaksi.id,
                        TokoId : 1,
                        PenerimaId : cart[val].penerimaId,
                        jumlah : cart[val].jumlah,
                        nilaiSubtotal : cart[val].nilaiSubtotal
                    }).then(function(){
                        console.log(val+ - +cart.length);
                        test.done();
                        //if((val+2) == cart.length){
                        //    console.log(val+ - +cart.length)
                        //    //habis ini di redirect ke halaman konfirmasi
                        //    test.done();
                        //}
                    })
                }
        });
}
function insertCartToInvoice(test){
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
                ""+totalPerTagihan[val]+", '"+cart[val].keterangan+"');";

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
                            test.done();
                        });
                }
            }
        }
    });

}
function insertCart(test){
    var cart = [];
    var totalTagihan = [];
    cart.push({
        id : 11,
        Produk : [
            {id: 1, jumlah : 2,
                totalHargaBarang : 20,
                harga : 1000000
            },
            {id: 2, jumlah : 3,
                totalHargaBarang : 30,
                harga : 1000000
            }
        ],
        ongkosKirim : 20,
    });
    cart.push({
        id : 11,
        Produk : [
            {id: 1, jumlah : 2,
                totalHargaBarang : 400,
                harga : 1000000
            }
        ],
        ongkosKirim : 20,
    });
    var totalPembayaran = 0;

    for(var val in cart){
        var cartArr = cart[val];
        totalTagihan[val] = 0;
        for(var valPro in cartArr.Produk){
            //todo: tidak bisa untuk hitung sebanyak n-tagihan, hanya bisa hitung persatu tagihan
            var produkDalamTagihan = cartArr.Produk;
            totalTagihan[val] = totalTagihan[val] +
                parseInt( produkDalamTagihan[valPro].totalHargaBarang );
            if(valPro == (produkDalamTagihan.length - 1) ){
                totalTagihan[val] = totalTagihan[val]+
                    parseInt(cartArr.ongkosKirim);
            }
        }
        console.log(tagihan +val+ - +totalTagihan[val]);
        totalPembayaran = totalPembayaran + totalTagihan[val];
    }
    test.done();
}
function deleteCart(test){
    var stack = {};
    var cart = [];

    stack.insertCart = function(callback){
        cart.push({
            produk : [{id:1},{id:2}]
        });
        cart.push({
            produk : [{id:18},{id:19}]
        });
        cart.push({
            produk : [{id:20},{id:21}]
        });
        callback(null,'');
    };
    stack.deletetCart = function(callback){
        cart.splice(2,3);
        callback(null,'');
    };
    stack.deletetCart = function(callback){
        cart.splice(2,3);
        callback(null,'');
    };
    stack.printCart = function(callback){
        for(var val in cart){
            console.log(cart[val]);
        }
        callback(null,'');
    };
    async.series(stack,function(err){
        test.done();
    });


    //var cart1 = [];
    //for(val in cart){
    //    var cartArr = cart[val].produk;
    //    for(valPro in cartArr){
    //        cart1.push(cartArr[valPro].id);
    //    }
    //}
    //console.log(cart1);

    //models.Produk.findAll({
    //    where : {
    //        id : {$in: cart1}
    //    },
    //    include: [models.Toko]
    //}).then(function(produk) {
    //    console.log(produk);
    //    test.done();
    //});
}
function pengaturanToko(test){
    models.Produk.findAndCountAll({
        include : models.Etalase,
        group   : etalaseId,
        where   : {tokoId:1}
    }).then(function(produk){
        console.log(produk.count);
        console.log(produk.rows);
        console.log(produk.rows[0].Etalase.nama+ - +produk.count[0].count);
        console.log(produk.rows[1].Etalase.nama+ - +produk.count[1].count);
        test.done()
    });
}
function getOngkir(test){
    ongkir.getOngkosKirim(
        100,44,1000,
        function(ongkosKirim){
            console.error(ongkosKirim);
            test.done();
        });
}
function getOngkir1(test){
    models.Toko.find({
        where:{id:1}
    }).then(function(toko){
        models.Produk.find({
            where:{id:1}
        }).then(function(produk){
            console.log(produk.berat);
            console.log(toko.KabupatenId);
            ongkir.getOngkosKirim(
                toko.KabupatenId,1,produk.berat,
                function(ongkosKirim){
                    console.log(ongkosKirim);
                    test.done();
                });
        });
    });
}
function getToko(test){
    models.Toko.find({
        include: [
            { model: models.Produk, where : {id : 1},as:Produk,
                include : [models.Kategori_Produk] },
            models.Kabupaten
        ]
    }).then(function(toko) {
        console.log(toko.Kabupaten.nama);
        test.done();
    })
}
function beliProduk(test){

}

function kategoriProdukMilikToko(test){
    models.Produk.findAll({
        where : {
            TokoId : 1
        },
        include: [models.Kategori_Produk],
        attributes: [Kategori_Produk.id,Kategori_Produk.kategori],
        group : Kategori_Produk.id,
    }).then(function(result){
        console.log(result);
        test.done();
    })
}
function daftarProduk(test){
    models.Produk.findAll({
        where : {
            TokoId : 1
        },
        include: [models.Kategori_Produk,models.Etalase],
        attributes: {exclude : [tokoId,EtalaseId] }
    }).then(function(produk){
        console.log(produk);
        test.done();
    })
}
function getPenerima(test){
    models.Penerima.find({
        include: [
            models.Provinsi,models.Kabupaten
        ],
        //nanti diganti session pengguna
        where : {penggunaId : 1}
    }).then(function(penerima) {
        console.log(penerima.Kabupaten.nama);
        test.done();
    })
}
function insertProvinsi(test){
    var stack = {};
    stack.insertProvinsi = function(callback){
        models.Provinsi.create({
            id : 3222,
            nama : kendari,
        }).then(function() {
            models.Provinsi.findAndCountAll()
                .then(function(result){
                    console.log('total baris provinsi : '+result.count);
                    callback(null);
                })
        });
    };
    stack.insertKabupaten = function(callback){
        models.Kabupaten.create({
            id : 221,
            nama : kendari
        }).then(function() {
            models.Provinsi.findAndCountAll()
                .then(function(result){
                    console.log('total baris kabupaten : '+result.count);
                    callback(null);
                })
        });
    };
    async.series(stack,function(err){
        test.done();
    });

}
function profilToko(test){
    var stack = {};
    //stack.getToko = function(callback){
    //    models.Toko.find({
    //        include: [
    //            { model: models.Produk,as:Produk,where : {etalaseId :1},
    //                include : models.Etalase
    //            }
    //        ],
    //        where : { id : 1 }
    //    }).then(function(toko) {
    //        callback(null,toko);
    //    })
    //};
    //stack.getEtalase = function(callback){
    //    models.Etalase.find().then(function(etalase) {
    //        callback(null,etalase);
    //    })
    //};
    stack.getJumlahTransaksiBerhasil = function(callback){
        models.Transaksi.findAndCountAll({
            where : {penjualId :'1',status_tampil :'1'}
        }).then(function(jumlah) {
            callback(null,jumlah);
        });
        //models.Transaksi.findAll({
        //    attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'jumlah']],
        //    where : {penjualId :'1',status_tampil :'1'}
        //}).then(function(jumlah) {
        //    callback(null,jumlah);
        //});
    };
    async.series(stack,function(err,result){
        console.log(result.getJumlahTransaksiBerhasil.count);
        test.done();
    });

}

function produkMilikToko(test){
    models.Toko.find({
        include: [
            { model: models.Produk,as:Produk,where : {etalaseId :1},
                include : models.Etalase
            }
        ],
        where : { id : 1 }
    }).then(function(toko) {
        models.Invoice.sum(jumlah,{where : {tokoId :2}})
            .then(function(produkTerjual){
            //console.log(toko.Produk[0].Etalase.nama);
            console.log(produkTerjual);
            //console.log(toko);
            test.done();
        });

    })
}
function jumlahTerjual(test){
    models.Invoice.sum(jumlah,{where : {produkId :1}})
        .then(function(jumlah_terjual) {
            console.log(jumlah_terjual);
            test.done();
        })
}
function detailProduk(test){
    var stack = {};
    stack.getJumlahTerjual = function(callback){
        models.Invoice_Produk.sum(jumlah_produk,{
            where : {produkId :1}
        }).then(function(jumlah_terjual) {
            callback(null,jumlah_terjual);
        })
    };
    stack.getTokoDanProduk = function(callback){
        models.Produk.find({
            include: [
                { model: models.Toko,
                    include : [models.Kabupaten] },
                models.Kategori_Produk
            ],
            where : {id : 1}
        }).then(function(toko) {
            callback(null,toko);
        })
    };
    async.parallel(stack,function(err,result){
        console.log(result.getTokoDanProduk.Toko);
        console.log(result.getJumlahTerjual);
        test.done();
        //jumlah_terjual : result.getJumlahTerjual
        //jika eror, itu karena beberapa daerah tidak bisa dilayani POS(ex:daerah lampung)
        //cari cara error handling di node js
        //data provinsi diambil saat masih menggunakan modal
        //listProvinsi : result.getListProvinsi
    });
}
