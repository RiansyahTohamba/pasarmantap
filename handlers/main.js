var models  = require('../models');

exports.utama= function(req, res){
	models.Kategori_Produk.findAll()
		.then(function(kategori_produk) {
		res.render('index',{
			kategori_produk : kategori_produk
		});
	})
};

exports.beranda = function(req, res){
	res.render('pengguna/beranda');
};

exports.ceklogin = function(req, res, next) {
	//buat session jika berhasil login
	models.Pengguna.find({
		attributes: ['nama'],
		where : {
			$and : [ { sandi : req.body.sandi}, { email : req.body.email } ]
		}
	}).then(function(pengguna) {
		if(pengguna){
			req.session.nama =  pengguna.nama;
			req.session.loggedin = "true";
			res.redirect( '/home' );
		}else{
			//buat pesan gagal
			res.send('gagal masuk')
		}
	})
}

exports.profil = function(req, res){
	res.render('pengguna/beranda');
};
