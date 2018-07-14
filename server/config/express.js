/* Código simplório, apenas para fornecer o serviço para a aplicação */

var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var routes     = require('../app/routes');

var app        = express();

app.set('clientPath', path.join(__dirname, '../..', 'client'));
console.log(app.get('clientPath'));

app.use(express.static(app.get('clientPath')));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

routes(app);

module.exports = app;