import { getIO } from '../config/socket';

// Swallow errors so a push failure never breaks the request that triggered it
export const emitToRoom = (room: string, event: string, payload: unknown): void => {
  try {
    getIO().to(room).emit(event, payload);
  } catch {
    // ignore — server may not be ready yet
  }
};
