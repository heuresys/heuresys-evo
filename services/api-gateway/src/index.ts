import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './middleware/log.js';
import { errorHandler } from './middleware/error.js';
import { healthRouter } from './routes/health.js';
import { employeesRouter } from './routes/employees.js';
import { authRouter } from './routes/auth.js';
import './types.js';

const app = express();
const PORT = Number(process.env.PORT ?? 8200);

const corsOrigins = (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean);

// Disable Express's "X-Powered-By" header (also done by helmet but explicit).
app.disable('x-powered-by');

// Trust the loopback proxy when running behind nginx (production).
app.set('trust proxy', 'loopback');

app.use(logger);
app.use(helmet());
app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);

// IMPORTANT: Auth.js mounts its own raw body parser internally; mount the
// router BEFORE express.json() to avoid double-parsing.
app.use('/auth', authRouter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/health', healthRouter);
app.use('/employees', employeesRouter);

// 404 catch-all (must be before errorHandler).
app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api-gateway] listening on :${PORT}`);
});
