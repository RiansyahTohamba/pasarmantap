var models  = require('../models');
var async  = require('async');
var sequelize = require("sequelize");
var credentials = require('../api/credentials.js');
var ongkir = require('../api/rajaOngkir')({
	key: credentials.rajaOngkir.key
});

exports.utamaMobile = function(req, res){
	async.parallel([
			function(callback){
				models.Invoice_Produk.findAll({
					attributes : ['Produk.nama','Produk.harga','Produk.gambar'],
					limit : '3',
					include : models.Produk,
					group : 'produkId',
					order : [ [sequelize.fn('sum',sequelize.col('jumlah_produk')),'DESC'] ]
				}).then(function(produk) {
					callback(null,produk);
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
			res.render('mobile/index',{
				hotlist : result[0],
				kategori_produk : result[1]
			})
		}
	)
}

exports.utama = function(req, res){
	async.parallel([
			function(callback){
				models.Invoice_Produk.findAll({
					attributes : ['Produk.nama','Produk.harga','Produk.gambar'],
					limit : '3',
					include : models.Produk,
					group : 'produkId',
					order : [ [sequelize.fn('sum',sequelize.col('jumlah_produk')),'DESC'] ]
				}).then(function(produk) {
					callback(null,produk);
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

exports.berandaMobile = function(req, res){
	//mengambil daftar produk terlaris
	models.Invoice_Produk.findAll({
		attributes : ['Produk.nama','Produk.harga','Produk.gambar'],
		limit : '3',
		include : models.Produk,
		group : 'produkId',
		order : [ [sequelize.fn('sum',sequelize.col('jumlah_produk')),'DESC'] ]
	}).then(function(produkTerlaris) {
		//mengambil wish list
		models.Wishlist.findAll({
			include : models.Produk
		}).then(function(wishList) {
			models.Kategori_Produk.findAll({
				attributes : {exclude :['deskripsi']}
			}).then(function(kategori_produk) {
				res.render('mobile/pc-view/beranda',{
					kategori_produk : kategori_produk,
					hotlist : produkTerlaris,
					wishList : wishList
				})
			})
		})
	})
};

exports.beranda = function(req, res){
	var stack = {};

	stack.getHotList = function(callback){
		models.Invoice_Produk.findAll({
			attributes : ['Produk.nama','Produk.harga','Produk.gambar'],
			limit : '6',
			include : models.Produk,
			group : 'produkId',
			order : [ [sequelize.fn('sum',sequelize.col('jumlah_produk')),'DESC'] ]
		}).then(function(produk) {
			callback(null,produk);
		})
	};
	async.parallel(stack,function(err,result){
		res.render('pc-view/beranda',{
			hotlist : result.getHotList
		})
	})
};
//sebenarnya yang harus di delete adalah sesi yang ada di res.locals.session
exports.keluar = function(req, res, next) {
	delete req.session.nama;
	delete req.session.penggunaId;
	delete req.session.tokoId;
	delete req.session.namaToko;
	delete req.session.loggedIn;
	delete req.session.cart;
	res.redirect('/');
};

exports.ceklogin = function(req, res, next) {
	//buat session jika berhasil login
	models.Pengguna.find({
		where : {
			$and : [ { sandi : req.body.sandi}, { email : req.body.email } ]
		},
		include : models.Toko
	}).then(function(pengguna) {
		if(pengguna){
			req.session.penggunaId =  pengguna.id;
			req.session.nama =  pengguna.nama;
			req.session.foto =  pengguna.foto;
			//saat pendaftaran awal tokoId di set 0
			if(pengguna.TokoId != 0){
				req.session.namaToko =  pengguna.Toko.nama;
			}
			req.session.tokoId =  pengguna.TokoId;
			req.session.loggedIn =  'true';
			res.redirect('/pc-view/beranda');
		}else{
			res.send('<body onload="notifGagal()">' +
				'<script>' +
					'function notifGagal(){ alert("Email dan Sandi Salah"); location.href="/"; } ' +
				'</script></body>')
		}
	})
};
exports.cekloginMobile = function(req, res, next) {
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
			res.redirect('/beranda');
		}else{
			//buat pesan gagal
			res.send('gagal masuk')
		}
	})
};
//request AJAX
//app.get('/getongkir/:idKotaTujuan/:idProduk',main.getOngkir);
//todo: cari cara hitung total berat
exports.getOngkir = function(req, res, next){
	//models
	models.Toko.find({
		where:{id:res.locals.session.tokoId}
	}).then(function(toko){
		//TODO: saat pengujian selesai kembalikan lagi
		//ongkir.getOngkosKirim(
			ongkir.getOngkosKirimOffline(
			toko.KabupatenId,req.params.idKotaTujuan,req.params.berat,
			function(ongkosKirim){
				res.send({ongkos:ongkosKirim});
			});
	});
};

exports.getPenerima = function(req, res, next) {
	models.Penerima.find({
		include: [
			models.Provinsi,models.Kabupaten
		],
		//nanti menggunakan session pengguna
		where : {id : req.params.idPenerima}
	}).then(function(penerima) {
		res.send(penerima);
	})
};
//fungsi ini sebelum menggunakan API, data kabupaten didapatkan dari database local
exports.getKabupaten = function(req, res, next) {
	//buat session jika berhasil login
	models.Kabupaten.findAll({
		attributes: ['nama','id'],
		where : { provinsiId : req.params.id }
	}).then(function(listKabupaten) {
		var kabupatenHTML = [];
		for(var val in listKabupaten){
			kabupatenHTML[val] = "<option value="+listKabupaten[val].id+">" +
				listKabupaten[val].nama+"</option>";
		}
		res.send({listArr:kabupatenHTML});
		// res.send(kabupatenHTML);
	})
}

//fungsi ini sebelum menggunakan API, data kecamatan didapatkan dari database local
//exports.getKecamatan = function(req, res, next) {
//	models.Kecamatan.findAll({
//		attributes: ['nama','id'],
//		where : { kabupatenId : req.params.id }
//	}).then(function(listKecamatan) {
//		var kecamatanHTML = [];
//		for(var val in listKecamatan){
//			kecamatanHTML[val] = "<option value="+listKecamatan[val].id+">" +
//				listKecamatan[val].nama+"</option>";
//		}
//		res.send({listArr:kecamatanHTML});
//	})
//}

exports.profil = function(req, res){
	res.render('pc-view/beranda');
};
