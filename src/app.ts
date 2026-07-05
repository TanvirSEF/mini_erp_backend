import express, { Application } from 'express';
import cors from 'cors';

const app: Application = express();

// ---- Built-in & third-party middlewares ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Application routes (wire up in app/routes) ----
// app.use('/api/v1', router);

// ---- Health check ----
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
