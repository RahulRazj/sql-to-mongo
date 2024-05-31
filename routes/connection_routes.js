import express from 'express';
import { checkMongoConnection, checkSqlConnection } from '../controller/connection_controller.js';

const app = express();

app.post('/checkSqlConnection', checkSqlConnection);
app.post('/checkMongoConnection', checkMongoConnection);

export default app;
