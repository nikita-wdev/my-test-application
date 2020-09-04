/* eslint new-cap: 0 */
'use strict';

// core packages
const express = require('express');
const router = express.Router();

// Swagger docs
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger');
const options = {
	explorer: true,
	withCredentials: true
};

// api
const{GraphicsMarkup} = require('../api');

class Routes {
	constructor(app){
		// init
		this.app = app;
	}

	init(){
		// set api routing
		router.route('/graphics-markup').get(GraphicsMarkup.getAll.bind(GraphicsMarkup));
		router.route('/locations').get(GraphicsMarkup.getLocations.bind(GraphicsMarkup));

		this.app.use('/api', router);

		// init swagger
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

		// not found routing
		this.app.use('*', (req, res, next) => {
			return res.status(404).json({
				statusCode: 404,
				message: `HTTP resource was found that matches the request URI ${req.baseUrl}`
			});
		});
	}
}

module.exports = Routes;
