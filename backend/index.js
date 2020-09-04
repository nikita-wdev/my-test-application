'use strict';

// Core packages
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const _ = require('lodash');

// Components
const Cors = require('./components/cors');

// Routes
const Routes = require('./routes');

class Server {
	constructor(){
		this.app = express();
		this.port = _.parseInt(process.env.PORT, 10) || 3000;
	}

	async start(){
		await this.setCore();
		await this.initClasses();

		const server = http.createServer(this.app);
		server.listen(this.port, () => {
			console.log(`The server is running at http://localhost:${this.port});`);
		});
	}

	setCore(){
		this.app.set('port', this.port);

		this.app.use(bodyParser.json({limit: '50mb'}));
		this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

		// CORS
		this.app.options('*', Cors);

		this.app.all('*', (req, res, next) => {
			// parse parameters. Request body has higher priority than query parameters.
			req.parameters = _.merge({}, req.query, req.body);

			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'X-Requested-With');
			next();
		});
	}

	async initClasses(){
		return Promise.mapSeries([
			new Routes(this.app)
		], async(initClass) => {
			return initClass.init.call(initClass);
		});
	}
}

const serverInstance = new Server();
return serverInstance.start();
