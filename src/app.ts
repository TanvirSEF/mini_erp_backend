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

// parsers
app.use(express.json());
app.use(cors());

// swagger docs
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Mini ERP API Engine Backend.',
  });
});

// must be registered last
app.use(globalErrorHandler);

// unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route handling target not found.',
  });
});

export default app;
