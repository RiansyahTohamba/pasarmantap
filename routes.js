//var penggunaController = require('./controllers/pengguna.js');
var pembelianController = require('./controllers/pembelian.js');
var produkController = require('./controllers/produk.js');
var penjualanController = require('./controllers/penjualan.js');
var main = require('./handlers/main.js');

function checkAuth(req, res, next) {
	if (!req.session.loggedin) {
		res.send('kamu tidak dapat mengakses halaman ini kembali ke <a href="/">halaman login</a>');
	} else {
		next();
	}
};

module.exports = function(app){
	// route untuk halaman tanpa controller (halaman main)
	app.get('/', main.utama);
	app.post('/ceklogin', main.ceklogin);
	app.get('/keluar', main.keluar);

	//setelah login
	app.get('/pengguna/beranda', checkAuth,main.beranda);

	// route untuk data pengguna
	//penggunaController.registerRoutes(app);

	//route untuk data pembelian
	pembelianController.registerRoutes(app,checkAuth);
	//route untuk data produk
	produkController.registerRoutes(app,checkAuth);
	//route untuk data penjualan
	penjualanController.registerRoutes(app,checkAuth);
};
