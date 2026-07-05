import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/docs/swagger.json'), 'utf-8')
);

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// API Docs (Swagger UI)
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Application Routes
app.use('/api/v1', router);

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
