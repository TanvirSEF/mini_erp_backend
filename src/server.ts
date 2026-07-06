import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { initSocketServer } from './app/config/socket';
import { seedRoles } from './app/modules/role/role.seed';

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database connected successfully');

    // Seed default roles & permissions (idempotent — safe on every boot)
    await seedRoles();
    console.log('Default roles and permissions are ready');

    // Use an explicit HTTP server so Socket.IO can attach to it
    const server = http.createServer(app);
    initSocketServer(server);

    server.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });

    // Fail fast on unhandled rejections instead of running in a broken state
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
    process.exit(1);
  }
}

bootstrap();
