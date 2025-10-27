import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
	console.error('Error:', err);

	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: message,
		...(env.NODE_ENV === 'development' && { stack: err.stack })
	});
};

export const notFound = (req, res, next) => {
	res.status(404).json({
		error: 'Route not found'
	});
};
