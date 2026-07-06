import { Server as SocketServer } from 'socket.io';
import http from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from './index';

// Held in module scope so other files can reach the running server via getIO()
let io: SocketServer | null = null;

export const initSocketServer = (server: http.Server): SocketServer => {
  io = new SocketServer(server, {
    cors: {
      origin: config.client_url,
      credentials: true,
    },
  });

  // Clients must send their access token in handshake.auth
  io.use((socket, next) => {
    const token = (socket.handshake.auth?.token as string) || undefined;

    if (!token) {
      return next(new Error('Authentication token is required.'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error('Invalid or expired token.'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user as JwtPayload | undefined;

    // Group clients by role for targeted broadcasts
    if (user?.role) {
      socket.join(`role:${user.role}`);
    }

    // Dashboard channel for live sale/low-stock updates
    socket.join('dashboard');
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) {
    throw new Error('Socket.IO server has not been initialised yet.');
  }
  return io;
};
