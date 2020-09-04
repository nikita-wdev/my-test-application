'use strict';
// app packages
const fs = require('fs');
const _ = require('lodash');

const path = require('path');
const root = path.dirname(require.main.filename);

// TODO  message and status code for response can be move to contacts.

class GraphicsMarkup {
	constructor(){}

	/**
	 * Get graphics-markup video data
	 *
	 * @memberOf GraphicsMarkup
	 *
	 * @param {Object} req - The request object
	 * @param {Object} res - The response object
	 * @param {Number} [req.parameters.page] - The number of page.
	 * @param {Number} [req.parameters.limit] - The number of records to return.
	 * @param {String} [req.parameters.order] - An string of attribute to sort results. Defaults to `in_frame`.
	 * @param {Object} [req.parameters.filters] - An Object to filters results. Defaults to ``.
	 * @return {Promise.<Object[]>} - A promise with an array of graphics-markup objects.
	 */
	async getAll(req, res){
		try{
			const page = _.get(req, 'parameters.page', 1);
			const limit = _.get(req, 'parameters.limit', 15);
			const orderBy = _.get(req, 'parameters.orderBy', 'in_frame');
			const direction = _.get(req, 'parameters.direction', 'asc');
			const filters = req.parameters.filters ? JSON.parse(req.parameters.filters) : {};

			// get json data and parse it to object.
			// TODO can be move to service
			let data = JSON.parse(fs.readFileSync(`${root}/_example_data/data.json`, 'utf8'));
			if(!data){
				return res.status(200).json({
					statusCode: 200,
					errors: null,
					message: 'OK',
					data: []
				});
			}


			// filtering data
			if(!_.isEmpty(filters)){
				if(_.size(filters.location)){
					data = _.filter(data, (item) => {
						return _.some(item.content.location, (item) => _.includes(filters.location, item));
					});
				}
			}

			// order data
			data = _.orderBy(data, (item) => {
				return _.parseInt(item[orderBy]);
			}, _.toLower(direction));

			// get total rows and paginate data
			const total = _.size(data);
			const results = _(data)
				.drop((page - 1) * limit) // offset
				.take(limit) // limit
				.value();

			return res.status(200).json({
				statusCode: 200,
				errors: null,
				message: 'OK',
				data: {
					results,
					total
				}
			});
		}catch(e){
			return res.status(500).json({
				statusCode: 500,
				errors: e,
				message: 'Internal Server Error',
				data: []
			});
		}
	}

	/**
	 * Get locations list
	 *
	 * @memberOf GraphicsMarkup
	 *
	 * @param {Object} req - The request object
	 * @param {Object} res - The response object
	 * @return {Promise.<Object[]>} - A promise with an array of locations objects.
	 */
	async getLocations(req, res){
		try{
			// get json data and parse it to object.
			// TODO can be move to service
			const data = JSON.parse(fs.readFileSync(`${root}/_example_data/data.json`, 'utf8'));
			if(!data){
				return res.status(200).json({
					statusCode: 200,
					errors: null,
					message: 'OK',
					data: []
				});
			}

			// get all unique locations
			const locations = _.sortBy(_.reduce(data, (locations, item) => {
				const contentLocations = _.get(item, 'content.location', []);
				_.forEach(contentLocations, (location) => {
					if(!_.includes(locations, location)){
						locations.push(location);
					}
				});
				return locations;
			}, []));

			return res.status(200).json({
				statusCode: 200,
				errors: null,
				message: 'OK',
				data: locations
			});
		}catch(e){
			return res.status(500).json({
				statusCode: 500,
				errors: e,
				message: 'Internal Server Error',
				data: []
			});
		}
	}
}

module.exports = new GraphicsMarkup();
