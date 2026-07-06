import { Server as SocketServer } from 'socket.io';
import http from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from './index';

// The socket server is created lazily and held in this module so the rest
// of the app can reach it through getIO() without passing it around.
let io: SocketServer | null = null;

// Boot the Socket.IO server and attach JWT authentication to every connection.
export const initSocketServer = (server: http.Server): SocketServer => {
  io = new SocketServer(server, {
    cors: {
      origin: config.client_url,
      credentials: true,
    },
  });

  // Handshake middleware: the client must pass its access token in handshake.auth
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

    // Group clients by role so we can target broadcasts, e.g. all managers
    if (user?.role) {
      socket.join(`role:${user.role}`);
    }

    // Every authenticated client listens on the dashboard channel for
    // live sale and low-stock notifications.
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
