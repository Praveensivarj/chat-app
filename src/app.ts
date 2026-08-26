import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: process.env.MAX_REQUEST_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true }));

import path from 'path';

app.use(express.static(path.join(process.cwd(), 'public')));

import { i18n } from './config/i18n.config';
app.use(i18n.init);

import routes from './routes';
import { setupSwagger } from './docs/swagger';

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

setupSwagger(app);
import { responseMiddleware } from './middleware/response.middleware';
app.use(responseMiddleware);

app.use('/api', routes);

app.use(errorMiddleware);

export default app;
