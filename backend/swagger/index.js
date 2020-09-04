'use strict';

// core packages
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const config = {
	swagger: '2.0',
	info: {
		title: '',
		description: '',
		version: '1.0'
	},
	produces: ['application/json'],
	host: 'localhost:3015',
	basePath: '/api',
	paths: {}
};

const root = path.dirname(require.main.filename);
const swaggerDir = fs.readdirSync(`${root}/swagger/`);
const swaggerFiles = _.filter(swaggerDir, (file) => {
	return _.includes(file, '.js') && (file !== 'index.js');
});

_.forEach(swaggerFiles, function(swaggerFile){
	// eslint-disable-next-line global-require
	const doc = require(path.join(`${root}/swagger/`, swaggerFile));
	_.merge(config.paths, doc);
});

module.exports = config;
