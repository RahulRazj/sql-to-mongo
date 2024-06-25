const response = text => {
	return `${text} successfully!`;
};

const generateResponse = params => {
	return {
		message: response(params.msg),
		code: params.code || 200,
		status: params.status || 200
	};
};


export default {
    SQL_CONNECTION_SUCCESS: generateResponse({ msg: 'SQL Connection established' }),
    MONGO_CONNECTION_SUCCESS: generateResponse({ msg: 'Mongo Connection established' }),
};