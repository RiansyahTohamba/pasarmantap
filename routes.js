//var penggunaController = require('./controllers/pengguna.js');
var pembelianController = require('./controllers/pembelian.js');
var produkController = require('./controllers/produk.js');
var penjualanController = require('./controllers/penjualan.js');
var main = require('./handlers/main.js');

module.exports = function(app){

	// route untuk halaman tanpa controller (halaman main)
	app.get('/', main.utama);

	//setelah login
	app.get('/pengguna/beranda', main.beranda);

	// route untuk data pengguna
	//penggunaController.registerRoutes(app);

	//route untuk data pembelian
	pembelianController.registerRoutes(app);
	//route untuk data produk
	produkController.registerRoutes(app);
	//route untuk data penjualan
	penjualanController.registerRoutes(app);
};
