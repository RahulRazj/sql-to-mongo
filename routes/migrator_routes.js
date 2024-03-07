import express from 'express';
import { migrate } from '../controller/migrator_controller.js';

const app = express();

app.post('/migrate', migrate);

export default app;
