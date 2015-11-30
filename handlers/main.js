var models  = require('../models');
var async  = require('async');

exports.utama= function(req, res){
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
				models.Kategori_Produk.findAll({
					attributes : {exclude :['deskripsi']}
				}).then(function(kategori_produk) {
					callback(null,kategori_produk);
				})
			}
		],
		function(err,result){
			res.render('index',{
				hotlist : result[0],
				kategori_produk : result[1]
			})
		}
	)
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
					where : { $and : [ { terlaris : 1 }, { KategoriProdukId : 12  } ] },
				}).then(function(smartphone) {
					callback(null,smartphone);
				})
			},
			function(callback){
				models.Hotlist.findAll({
					where : { $and : [ { terlaris : 1 }, { KategoriProdukId : 1  } ] },
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
exports.keluar = function(req, res, next) {
	req.session.destroy();
	res.redirect('/');
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
			res.redirect( '/pengguna/beranda' );
		}else{
			//buat pesan gagal
			res.send('gagal masuk')
		}
	})
}

exports.profil = function(req, res){
	res.render('pengguna/beranda');
};
