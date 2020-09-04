'use strict';

const docs = {
	'/graphics-markup': {
		get: {
			operationId: 'get',
			tags: ['graphics'],
			description: 'Get graphics-markup video data',
			parameters: [
				{
					in: 'query',
					name: 'page',
					description: 'The number of page.',
					required: false,
					type: 'integer',
					format: 'int64',
					default: 1
				},
				{
					in: 'query',
					name: 'limit',
					description: 'The number of records to return.',
					required: false,
					type: 'integer',
					format: 'int64',
					default: 10,
					minimum: 1,
					maximum: 1000
				},
				{
					in: 'query',
					name: 'orderBy',
					description: 'order by column name',
					required: false,
					type: 'string',
					default: 'in_frame',
					style: 'form'
				},
				{
					in: 'query',
					name: 'direction',
					description: 'direction - asc or desc',
					required: false,
					somedefault: 'asc',
					type: 'string',
					default: 'asc',
					style: 'form'
				},
				{
					in: 'query',
					name: 'filters',
					description: 'filtering data',
					required: false,
					type: 'object',
					properties: {location: {type: 'array'}},
					default: '',
					example: '{"location":["Lower"]}',
					style: 'form'
				}
			],
			responses: {
				200: {
					description: 'successful operation',
					// TODO can be added schema for response
					schema: {
						type: 'object'
					}
				}
			}
		}
	},
	'/locations': {
		get: {
			operationId: 'get',
			tags: ['graphics'],
			description: 'Get locations list',
			parameters: [],
			responses: {
				200: {
					description: 'successful operation',
					schema: {
						type: 'object'
					}
				}
			}
		}
	}
};

module.exports = docs;
