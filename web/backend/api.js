const CONF = require('./api.json');
const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const http = require('http');
const https = require('https');
const loader = require('./api/loader.js');
const cors = require('cors');
//const helmet = require('helmet');
const fs = require('fs');
const sql = require('mssql');

// Definindo opções de ambiente
//process.env = CONF;
//const conf = CONF[process.env.ENV];

const conf = CONF["DEV"];

global.conf = conf;
global.pool = () => { return new sql.ConnectionPool(conf.CONNECTION_CONFIG) };

//var accessLogStream = fs.createWriteStream(conf.MORGAN.FILE, {flags: 'a'})

var api = express();

api.use(cors());

// Adicionando middlewares
// Protege contra alguns cabeçalhos maliciosos: https://github.com/helmetjs/helmet
//api.use(helmet());

// Faz o parse dos jsons do body: https://github.com/expressjs/body-parser
api.use(bodyParser.json({limit: '50mb'}));

// Parser dos parametros da URL
api.use(bodyParser.urlencoded( { limit: '50mb', extended: true } ));

// Adiciona validadores padrões: https://github.com/ctavan/express-validator
api.use(expressValidator([]));
//api.use(morgan(conf.MORGAN.TYPE, {stream: accessLogStream}));

api.use('/public',express.static('public'));

loader.start(api);

// Criando servidor de acordo com ambiente configurado.
switch (CONF.ENV) 
{
	case "PRD":

		http.createServer(function(req, res) 
		{   
			res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
			res.end();
		}, api).listen(80);

		https.createServer(
		{ 
			key: fs.readFileSync("/etc/letsencrypt/archive/example.com/privkey1.pem"),
			cert: fs.readFileSync("/etc/letsencrypt/archive/example.com/fullchain1.pem"),
			ca: fs.readFileSync("/etc/letsencrypt/archive/example.com/chain1.pem")
		}, api).listen(443);

		console.log("Server is running in PRD mode.");
		
		break;

	case "DEV":
		
		http.createServer(api).listen(process.env.PORT || 3000);
		console.log("Server is running in DEV mode.");

		break;

	default:
		break;
}