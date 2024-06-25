import dotenv from 'dotenv';
dotenv.config();

const HTTP_CODES = {
	SUCCESS: 200,
	INTERNAL_SERVER_ERROR: 500,
	BAD_REQUEST: 400,
	NOT_FOUND: 404
};

const BAD_REQUEST = { status: HTTP_CODES.BAD_REQUEST, code: HTTP_CODES.BAD_REQUEST };
const INTERNAL_SERVER_ERROR = { status: HTTP_CODES.INTERNAL_SERVER_ERROR, code: HTTP_CODES.INTERNAL_SERVER_ERROR };

const missingValue = text => {
	return `Invalid request, Missing mandatory field: ${text}`;
};

const invalidValue = text => {
	return `Bad request, Invalid field: ${text}`;
};

export default {
	// general errors
	INTERNAL_SERVER_ERROR: { message: 'Internal server error', ...INTERNAL_SERVER_ERROR, code: 1001 },

	// Connection errors
	SQL_CONNECTION_ERROR: { message: 'Connection to SQL server failed.', ...BAD_REQUEST, code: 1002 },
	MONGO_CONNECTION_ERROR: { message: 'Connection to Mongo server failed.', ...BAD_REQUEST, code: 1003 },

	// Validation errors
	MISSING_SQL_SERVER: { message: missingValue('SQL Server'), ...BAD_REQUEST, code: 1004 },
	MISSING_SQL_SERVER_USERNAME: { message: missingValue('SQL Server Username'), ...BAD_REQUEST, code: 1005 },
	MISSING_SQL_SERVER_PASSWORD: { message: missingValue('SQL Server Password'), ...BAD_REQUEST, code: 1006 },
	MISSING_SQL_SERVER_DATABASE_NAME: { message: missingValue('SQL Server Database Name'), ...BAD_REQUEST, code: 1007 },
	MISSING_MONGO_CONNECTION_STRING: { message: missingValue('Mongo Connection String'), ...BAD_REQUEST, code: 1008 }
};
