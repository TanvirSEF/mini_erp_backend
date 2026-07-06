import { getIO } from '../config/socket';

// swallow errors so a push failure never breaks the request
export const emitToRoom = (room: string, event: string, payload: unknown): void => {
  try {
    getIO().to(room).emit(event, payload);
  } catch {
    // server may not be ready yet
  }
};
