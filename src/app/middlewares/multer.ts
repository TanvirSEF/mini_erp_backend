import multer from 'multer';

// memory storage keeps the file in a buffer so it goes straight to cloudinary
// and nothing is ever written to the local uploads folder
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
