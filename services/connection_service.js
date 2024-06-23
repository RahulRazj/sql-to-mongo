import sql from 'mssql';
import mongoose from 'mongoose';
import successCodes from '../config/successCodes.js';
import errorCodes from '../config/errorCodes.js';

export const createSqlConnection = async payLoad => {
	try {
		const sqlConfig = {
			server: payLoad.sqlServer,
			user: payLoad.sqlServerUsername,
			password: payLoad.sqlServerPassword,
			database: payLoad.sqlServerDatabaseName,
			options: {
				trustedConnection: true
			}
		};

		const conn = await sql.connect(sqlConfig);

        console.log('Connection to Sql database successful');
		await conn.close();
		return Promise.resolve(successCodes.SQL_CONNECTION_SUCCESS);
	} catch (err) {
		console.log(err);
		return Promise.reject(errorCodes.SQL_CONNECTION_ERROR);
	}
};

export const createMongoDBConnection = async payLoad => {
	const options = {
		serverSelectionTimeoutMS: 6000
	};

	try {
		const connection = await mongoose.connect(payLoad.mongoConnectionString, options);

		await mongoose.disconnect();
		console.log('Connection to Mongo database successful');
		console.log('mongo connection', connection);
		return Promise.resolve(successCodes.MONGO_CONNECTION_SUCCESS);
	} catch (err) {
		console.log('err', err);
		return Promise.reject(errorCodes.MONGO_CONNECTION_ERROR);
	}
};
