/**
 * Created by riansyahPC on 3/19/2016.
 * skenario : membeli 2 produk -> keranjang -> konfirmasi -> konfirmasi pembayaran
 */
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder().forBrowser('firefox').build();
driver.get('http://localhost:3000/toko/buka');
driver.findElement(By.name('nama')).sendKeys('santosa');
driver.findElement(By.name('deskripsi')).sendKeys('toko pilihan anda');
driver.findElement(By.name('provinsiId')).sendKeys('p');
driver.findElement(By.name('kabupatenId')).sendKeys('p');
driver.findElement(By.name('kecamatan')).sendKeys('wua-wua');
driver.findElement(By.name('simpan')).click();
//body = driver.findElement(By.tagName('body'));
//body.sendKeys(webdriver.Key.CONTROL + 't');
//driver.get('http://localhost:3000/toko/buka');
//driver.findElement(By.name('namaToko')).sendKeys('santosa');
//driver.findElement(By.name('deskripsiToko')).sendKeys('toko pilihan anda');
//driver.findElement(By.name('provinsiId')).sendKeys('pale');
//driver.findElement(By.name('kabupatenId')).sendKeys('pale');
//driver.findElement(By.name('kecamatan')).sendKeys('wua-wua');
//driver.findElement(By.name('simpan')).click();
//test menunggu sebentar, dan hasilnya pasti eror
driver.wait(function(){}, 10000);

driver.quit();

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