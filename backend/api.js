const CONF = require('./api.json');
const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const http = require('http');
const https = require('https');
const loader = require('./api/loader.js');
const helmet = require('helmet');
const fs = require('fs');

// Definindo opções de ambiente
process.env = CONF;
const conf = CONF[process.env.ENV];
var accessLogStream = fs.createWriteStream(conf.MORGAN.FILE, {flags: 'a'})

var api = express();

// Adicionando middlewares
// Protege contra alguns cabeçalhos maliciosos: https://github.com/helmetjs/helmet
api.use(helmet());
// Faz o parse dos jsons do body: https://github.com/expressjs/body-parser
api.use(bodyParser.json());
// Parser dos parametros da URL
api.use(bodyParser.urlencoded( { extended: true } ));
// Adiciona validadores padrões: https://github.com/ctavan/express-validator
api.use(expressValidator([]));
api.use(morgan(conf.MORGAN.TYPE, {stream: accessLogStream}));

loader.start(api);

// Criando servidor de acordo com ambiente configurado.
switch (process.env.ENV) 
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
		
		http.createServer(api).listen(80);
		console.log("Server is running in DEV mode.");

		break;

	default:
	break;
}


