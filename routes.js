var penggunaController = require('./controllers/pengguna.js');
var main = require('./handlers/main.js');

module.exports = function(app){

	// route untuk halaman tanpa controller (halaman main)
	app.get('/', main.utama);

	//setelah login
	app.get('/pengguna/beranda', main.beranda);
	//app.get('/about', main.about);
	//app.get('/',function(req, res, next) {
	//	res.render('login', {
	//		title: 'ecommerce Barokah | Login'
	//	});
	//});

	// route pengguna
	//penggunaController.registerRoutes(app);

};
