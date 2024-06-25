import http from 'http';
import { createMongoDBConnection } from './mongoDbConnection.js';
import { createSqlConnection } from './sqlDbConnection.js';
import errorCodes from '../config/errorCodes.js';
import successCodes from '../config/successCodes.js';

export default class Bootstrap {
	constructor(app) {
		this.initializeConfig();
		this.port = this.normalizePort(process.env.PORT);
		this.server = http.createServer(app);

		this.server.listen(this.port);
		this.server.on('error', this.onError);
		this.server.on('listening', this.onListening);
		// this.createMongoDBConnection();
		// this.createSqlConnection();
	}

	normalizePort(val) {
		const port = parseInt(val, 10);

		if (isNaN(port)) {
			// named pipe
			return val;
		}
		if (port >= 0) {
			// port number
			return port;
		}

		console.error('Invalid Port', val);
		process.exit();
	}

	initializeConfig() {
		global.errorCodes = errorCodes;
		global.successCodes = successCodes;
	}

	async createMongoDBConnection() {
		try {
			await createMongoDBConnection();
		} catch (error) {
			console.error('whoops! There is an issue with connecting Mongo DB:', error);
			process.exit(0);
		}
	}

	async createSqlConnection() {
		try {
			await createSqlConnection();
		} catch (error) {
			console.error('whoops! There is an issue with connecting Sql DB:', error);
			process.exit(0);
		}
	}

	onError(error) {
		if (error.syscall !== 'listen') {
			throw error;
		}

		let bind = typeof this.port === 'string' ? `Pipe ${this.port}` : `Port ${this.port}`;

		switch (error.code) {
			case 'EADDRINUSE':
				console.error(`${bind} is already in use`);
				process.exit(1);
			default:
				throw error;
		}
	}

	onListening() {
		let addr = this.address();
		let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

		console.log(`API App is listening on ${bind}`);
		console.log('Use (Ctrl-C) to shutdown the application..');
	}
}
