import { createSqlConnection, createMongoDBConnection } from '../services/connection_service.js';

export const checkSqlConnection = async (req, res) => {
	try {
		const payLoad = {
			sqlServer: req.body.sqlServer,
			sqlServerUsername: req.body.sqlServerUsername,
			sqlServerPassword: req.body.sqlServerPassword,
			sqlServerDatabaseName: req.body.sqlServerDatabaseName
		};

		if (!payLoad.sqlServer) throw errorCodes.MISSING_SQL_SERVER;
		if (!payLoad.sqlServerUsername) throw errorCodes.MISSING_SQL_SERVER_USERNAME;
		if (!payLoad.sqlServerPassword) throw errorCodes.MISSING_SQL_SERVER_PASSWORD;
		if (!payLoad.sqlServerDatabaseName) throw errorCodes.MISSING_SQL_SERVER_DATABASE_NAME;

		const result = await createSqlConnection(payLoad);
		return res.done(result);
	} catch (err) {
		console.log(err);
		return res.error(err);
	}
};

export const checkMongoConnection = async (req, res) => {
	try {
		const payLoad = {
			mongoConnectionString: req.body.mongoConnectionString
		};

		if (!payLoad.mongoConnectionString) throw errorCodes.MISSING_MONGO_CONNECTION_STRING;
		const result = await createMongoDBConnection(payLoad);
		return res.done(result);
	} catch (err) {
		console.log(err);
		return res.error(err);
	}
};
