export const errorHanlderMiddleware = (req, res, next) => {
	res.error = err => {
		// If the error has a status code, use that. Otherwise default to 500 (Internal Server Error).
		const statusCode = err.status || errorCodes.INTERNAL_SERVER_ERROR.status;

		// Send the error details to the client.
		res.status(statusCode).json({
			status: 'ERROR',
			statusCode: statusCode,
			message: err.message
		});
	};

	next();
};

export const successHandlerMiddleware = (req, res, next) => {
	res.done = data => {
		res.status(200).json({
			status: 'SUCCESS',
			statusCode: 200,
			data: data
		});
	};

	next();
};
