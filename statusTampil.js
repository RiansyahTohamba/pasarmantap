exports.sudahCekOutOrder = 0;
exports.sudahKonfirmasiPembayaran = 1;
exports.sudahVerifikasiPembayaran = 2;
exports.pesananSedangDiproses = 3;
exports.pesananTelahDikirim = 4;
exports.pesananTibaDitujuan = 5;
exports.pesananDiterima = 6;
exports.logTransaksiDihapus = 7;
exports.pesananDibatalkanPenjual = 8;
exports.pengirimanDibatalkanKurir = 9;
exports.pembeliTidakMengkonfirmasi = 10;

//berpengaruh di halaman 
//controller/penjualan.js
//controller/pembelian.js
//controller/admin.js
//controller/toko.js , menghitung jumlah transaksi berhasil
//handler/cart.js
//di view 
// verifikasiPembayaran.jade dan dalampengiriman.jade
// statusPemesanan.jade untuk pengecekan tombol "sudah-diterima"