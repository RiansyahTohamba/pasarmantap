/**
 * Created by riansyahPC on 1/25/2016.
 */
var https = require('https'),
    qs = require('querystring');
var http       = require("http");

module.exports = function(rajaOngkirOptions){

    // this variable will be invisible outside of this module
    var accessToken;

    // this function will be invisible outside of this module
    function getAccessToken(cb){
        if(accessToken) return cb(accessToken);

        var options = {
            "method": "GET",
            "hostname": "api.rajaongkir.com",
            "port": null,
            "path": "/starter/province?id=12",
            "headers": {
                "key": rajaOngkirOptions.key
            }
        };
    }
    return {
        getOngkosKirimOffline : function(idKotaAsal,idKotaTujuan,beratProduk,cb){
            var ongkir = {"rajaongkir":{"query":{"origin":"44","destination":"17","weight":800,"courier":"pos"},"status":{"code":200,"description":"OK"},"origin_details":{"city_id":"44","province_id":"14","province":"Kalimantan Tengah","type":"Kabupaten","city_name":"Barito Selatan","postal_code":"73711"},"destination_details":{"city_id":"17","province_id":"1","province":"Bali","type":"Kabupaten","city_name":"Badung","postal_code":"80351"},"results":[{"code":"pos","name":"POS Indonesia (POS)","costs":[{"service":"Surat Kilat Khusus","description":"Surat Kilat Khusus","cost":[{"value":36500,"etd":"2-4","note":""}]}]}]}};            
            if(beratProduk > 1000 && idKotaTujuan > 20){
                ongkir.rajaongkir.results[0].costs[0].cost[0]['value'] = 100000;
            }else if(beratProduk > 500 && idKotaTujuan > 10){
                ongkir.rajaongkir.results[0].costs[0].cost[0]['value'] = 50000;
            }else{
                ongkir.rajaongkir.results[0].costs[0].cost[0]['value'] = 2000;
            }
            cb(ongkir.rajaongkir.results[0].costs[0].cost[0]['value']);
        },
        //saatpengujian selesai gunakan yang versi API ini
        getOngkosKirim : function(idKotaAsal,idKotaTujuan,beratProduk,cb){
            var options = {
                "method": "POST",
                "hostname": "api.rajaongkir.com",
                "port": null,
                "path": "/starter/cost",
                "headers": {
                    "key": rajaOngkirOptions.key,
                    "Content-Type" : 'application/x-www-form-urlencoded'
                }
            };

            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function (err,next) {
                    var ongkir = JSON.parse(chunks);
                    if(err){
                        console.log(err);                        
                        next();
                    }
                    if( !(ongkir.rajaongkir.results[0].costs[0]) ){
                        cb('405');
                    }else{
                        cb(ongkir.rajaongkir.results[0].costs[0].cost[0]['value']);    
                    }
                });
            });

            req.write(qs.stringify({
                origin: idKotaAsal,
                destination: idKotaTujuan,
                weight: beratProduk,
                courier: 'pos'
            }));
            req.end();
        },

    };
};
