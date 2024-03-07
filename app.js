import express from 'express';
import dotenv from 'dotenv';
import BootstrapApp from './system/bootstrap.js';
import RoutesConfig from './routes/index.js';
import mssql from 'mssql';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

new BootstrapApp(app);

app.use(express.json());

process.on('uncaughtException', (err, req) => {
  if (err && err.message !== 'TEST') {
    console.error('whoops! There was an uncaught error', err);
  }
});

process.on('unhandledRejection', function (reason, promise, req) {
  console.error('Unhandled rejection reason', reason);
  console.error('Unhandled rejection promise', promise);
});

async function cleanUpServer() {
  await mongoose.disconnect();
  await mssql.close();
  console.log('Exiting Node appp');
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach(eventType => {
  process.on(eventType, cleanUpServer.bind(null, eventType));
});

RoutesConfig(app);

export default app;
