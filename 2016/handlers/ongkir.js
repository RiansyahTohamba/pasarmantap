var models  = require('../models');
var async  = require('async');
var sequelize = require("sequelize");
var credentials = require('../api/credentials.js');
var ongkir = require('../api/rajaOngkir')({
	key: credentials.rajaOngkir.key
});

exports.getOngkir = function(req, res, next){
	//models
	models.Toko.find({
		where:{id:1}
	}).then(function(toko){
		ongkir.getOngkosKirimOffline(
		// ongkir.getOngkosKirim(
			toko.KabupatenId,req.params.idKotaTujuan,req.params.berat,
			function(ongkir){
				res.send(''+ongkir);
			});
	});
};
