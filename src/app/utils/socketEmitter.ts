import { getIO } from '../config/socket';

// Best-effort real-time broadcast.
// If the socket server is not ready yet we skip silently — a transient push
// failure must never break the API request that triggered the event.
export const emitToRoom = (room: string, event: string, payload: unknown): void => {
  try {
    getIO().to(room).emit(event, payload);
  } catch {
    // Socket server unavailable — nothing to do here.
  }
};
