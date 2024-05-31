import express from 'express';
import dotenv from 'dotenv';
import BootstrapApp from './system/bootstrap.js';
import RoutesConfig from './routes/index.js';
import cors from 'cors';
import mssql from 'mssql';
import mongoose from 'mongoose';
import { errorHanlderMiddleware, successHandlerMiddleware } from './middlewares/requestHanlder.js';

dotenv.config();
const app = express();

new BootstrapApp(app);

app.use(express.json());

app.use(errorHanlderMiddleware);
app.use(successHandlerMiddleware);

const ALLOWED_ORIGINS = process.env['Platform_ALLOWED_ORIGINS'].split(',');


app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || origin === 'null') return callback(null, true);
			if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
				var msg = 'The CORS policy for this site restricts access from the specified Origin.';
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		}
	})
);

app.use(function (req, res, next) {
	res.setHeader('X-Frame-Options', '*');
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Access-Control-Allow-Headers', process.env['Platform_ALLOWED_HEADERS']);
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
	next();
});

// process.on('uncaughtException', (err, req) => {
//   if (err && err.message !== 'TEST') {
//     console.error('whoops! There was an uncaught error', err);
//   }
// });

// process.on('unhandledRejection', function (reason, promise, req) {
//   console.error('Unhandled rejection reason', reason);
//   console.error('Unhandled rejection promise', promise);
// });

// async function cleanUpServer() {
//   await mongoose.disconnect();
//   await mssql.close();
//   console.log('Exiting Node appp');
// }

// [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach(eventType => {
//   process.on(eventType, cleanUpServer.bind(null, eventType));
// });

RoutesConfig(app);

export default app;
