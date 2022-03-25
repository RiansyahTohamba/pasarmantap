// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var http       = require("http");
var qs         = require("querystring");

// set your key rajaongkir.com
var key        = '9f13553065a3291fb5d719d18f3669ee';

var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var options = {
    "method": "GET",
    "hostname": "api.rajaongkir.com",
    "port": null,
    "path": "",
    "headers": {
        "key": key,
        "Content-Type" : 'application/x-www-form-urlencoded'
    }
};
//set cross domain
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set our port
var port = process.env.PORT || 8000;

// ROUTES FOR OUR API
var router = express.Router();

// get data province
router.get('/getprovinsi', function(req, response) {

    options.method = 'GET';
    options.path   = '/starter/province';
    //options.path   = '/starter/city?province=5';//menampilkan kabupaten di provinsi ber-Id

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var provinsi = JSON.parse(chunks);
            console.log(provinsi.rajaongkir.results);
            //sekarang latihan membuat cache
            //response.render('latihan',{
            //   listProvinsi : provinsi.rajaongkir.results
            //});
        });
    });

    req.end();
});
router.get('/getongkir', function(req, response) {

    options.method = 'POST';
    options.path   = "/starter/cost";

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var ongkir = JSON.parse(chunks);
            console.log(ongkir.rajaongkir.results[0].costs[0].cost[0].value);
        });



    });

    req.write(qs.stringify({
        origin: '501',
        destination: '114',
        weight: 1700,
        courier: 'jne'
    }));
    req.end();
});

// get data cost
router.get('/cost/:origin/:destination/:weight', function(req, response) {

    options.method = 'POST';
    options.path   = '/api/starter/cost';

    var self = this;
    self.origin      = req.params.origin;
    self.destination = req.params.destination;
    self.weight      = req.params.weight;

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            response.json(JSON.parse(body.toString()))
        });
    });

    req.write(qs.stringify({ origin: self.origin,
        destination: self.destination,
        weight: self.weight
        }));
    req.end();
});

// all of our routes will be prefixed with /api/v1
var version = 'v1';

app.use('/', router);

//start the server
app.listen(port);
console.log('Server running on port ' + port);