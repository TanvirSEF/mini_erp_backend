import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// Application Router Entry points
app.use('/api/v1/auth', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Mini ERP API Engine Backend.',
  });
});

// Global Error Handler Middleware (Must be defined last)
app.use(globalErrorHandler);

// Handle Not Found Routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route handling target not found.',
  });
});

export default app;
