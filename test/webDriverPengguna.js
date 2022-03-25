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
var waktuTungguLambat = 2.2 * 1000;
var waktuTungguCepat = 1 * 1000;
registrasi();

berhenti();

function registrasi(){
    driver.get('http://localhost:3000/pengguna/registrasi');
    driver.findElement(By.name('email')).sendKeys('mriansyah@gmail.com')
    driver.findElement(By.name('sandi')).sendKeys('biji')
    driver.findElement(By.name('nama')).sendKeys('riansyah')
    driver.findElement(By.name('jenis_kelamin')).sendKeys('laki')
    //nanti cari cara ganti foto
    //driver.findElement(By.id('fieldPhotoPengguna')).click()
    driver.findElement(By.id('simpan')).click()

}

function berhenti(){
    driver.wait(function(){}, 5000);
    driver.quit();
}


