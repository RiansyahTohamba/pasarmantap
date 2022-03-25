/**
 * Created by riansyahPC on 3/19/2016.
 * skenario : membeli 2 produk -> keranjang -> konfirmasi -> konfirmasi pembayaran
 */
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var async  = require('async');
var models  = require('../models');

var driver = new webdriver.Builder().forBrowser('firefox').build();

//todo: buat transaksi antar pembeli dan penjual hingga selesai
driver.manage().window().maximize();
//pembelianSatukodeInvoice();
var waktuTungguLambat = 2.2 * 1000;
var waktuTungguCepat = 1 * 1000;
//pembelianSatukodeInvoiceCepat();//1 toko yang sama,todo: gagal, total harga cuman muncul 1 digit,salah di cart.insertCartToInvoice
pembelian2toko2produk();//2 toko beda dan beli 2 produk di salah satu toko, berhasil
//pembelian2kodeInvoice();
//pembelianBanyakInvoice();//2 toko beda, berhasil

driver.findElement(By.name('btnKonfirmasi')).click();
driver.findElement(By.name('btnKonfirmasiPembayaran')).click();
berhenti();
//bersihkanTransaksi();

function pembelianBanyakInvoice(){
    driver.get('http://localhost:3000/produk/beli/2');//tokoId 1
    driver.findElement(By.name('jumlah')).sendKeys('2');
    driver.findElement(By.name('beliProduk')).click();
    driver.get('http://localhost:3000/produk/beli/37');//tokoId 3
    driver.findElement(By.name('jumlah')).sendKeys('5');
    driver.findElement(By.name('beliProduk')).click();
    driver.get('http://localhost:3000/produk/beli/31');//tokoId 2
    driver.findElement(By.name('beliProduk')).click();
}


function bersihkanTransaksi(){
    models.Invoice_Produk
        .destroy({
            where : {}
        }).then(function(){
            models.Invoice
                .destroy({
                    where : {}
                }).then(function(){
                    console.log('end');
                });
        });
}
function berhenti(){
    driver.wait(function(){}, 5000);
    driver.quit();
}



//dari toko yang beda untuk 1 transaksi diwaktu yang sama
function pembelian2kodeInvoice(){
    driver.get('http://localhost:3000/produk/beli/2');
    driver.findElement(By.name('jumlah')).sendKeys('2');
    driver.findElement(By.name('beliProduk')).click();
    driver.get('http://localhost:3000/produk/beli/31');
    driver.findElement(By.name('beliProduk')).click();
}
//dari toko yang sama untuk 1 transaksi diwaktu yang sama
function pembelianSatukodeInvoice(){
    driver.get('http://localhost:3000/');
    for(var n=0;n<2;n++){
        driver.findElement(By.id('kategori')).click()
        driver.findElement(By.id('pakaian')).click().then(function() {driver.sleep(waktuTungguLambat);})
        driver.findElement(By.id('detailProduk'+n)).click().then(function() {driver.sleep(waktuTungguLambat);})
        driver.findElement(By.id('btnBeliProduk')).click().then(function() {driver.sleep(waktuTungguCepat);})
        driver.findElement(By.name('jumlah')).sendKeys(''+(n+2)).then(function() {driver.sleep(waktuTungguLambat);})
        driver.findElement(By.name('beliProduk')).click().then(function() {driver.sleep(waktuTungguCepat);})
    }
    driver.findElement(By.name('btnKonfirmasi')).click()
    driver.findElement(By.name('btnKonfirmasiPembayaran')).click();

}

function pembelianSatukodeInvoiceCepat(){
    //pembelian dari 1 toko dan 1 penerima yang sama,sehingga menjadi 1 invoice,tapi hasilnya masuk ke pengondisian 2 invoice
    driver.get('http://localhost:3000/produk/beli/1');
    driver.findElement(By.name('jumlah')).sendKeys('2')
    driver.findElement(By.name('beliProduk')).click()
    driver.get('http://localhost:3000/produk/beli/2')
    driver.findElement(By.name('jumlah')).sendKeys('3')
    driver.findElement(By.name('beliProduk')).click()
}
function pembelian2toko2produk(){
    driver.get('http://localhost:3000/produk/beli/1');
    driver.findElement(By.name('jumlah')).sendKeys('2')
    driver.findElement(By.name('beliProduk')).click()
    driver.get('http://localhost:3000/produk/beli/2')
    driver.findElement(By.name('jumlah')).sendKeys('3')
    driver.findElement(By.name('beliProduk')).click()
    driver.get('http://localhost:3000/produk/beli/43')
    driver.findElement(By.name('jumlah')).sendKeys('3')
    driver.findElement(By.name('beliProduk')).click()
}


//driver.getTitle().then(function(title){
//    console.log(title)
//});
//driver.findElement(By.name('q')).sendKeys('webdriver');
//driver.findElement(By.name('btnG')).click();
//driver.wait(until.titleIs('webdriver - Google Search'), 3000);
//driver.quit();
//var webdriver = require('selenium-webdriver');
//
//var driver = new webdriver.Builder().build();
//driver.get('http://www.google.com');
//
//var element = driver.findElement(webdriver.By.name('q'));
//element.sendKeys('Cheese!');

//driver.quit();