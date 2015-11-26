var models  = require('../models');
var async  = require('async');

exports.utama= function(req, res){
	models.Kategori_Produk.findAll({
		attributes : {exclude :['deskripsi']}
	})
		.then(function(kategori_produk) {
		res.render('index',{
			kategori_produk : kategori_produk
		});
	})
};

exports.beranda = function(req, res){
	async.series([
			function(callback){
				models.Hotlist.findAll({
					limit : '3',
					order : 'id DESC'
				}).then(function(hotlist) {
					callback(null,hotlist);
				})
			},
			function(callback){
				models.Hotlist.findAll({
					where : { KategoriProdukId : '12' },
					limit : '3',
					order : 'id DESC'
				}).then(function(smartphone) {
					callback(null,smartphone);
				})
			},
			function(callback){
				models.Hotlist.findAll({
					where : { KategoriProdukId : '1' },
					limit : '3',
					order : 'id DESC'
				}).then(function(pakaian) {
					callback(null,pakaian);
				})
			}
		],
		function(err,result){
			res.render('pengguna/beranda',{
				hotlist : result[0],
				smartphone : result[1],
				pakaian : result[2]
			})
		}
	)
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
