import multer from 'multer';
import AppError from '../errors/AppError';

const storage = multer.memoryStorage();

const onlyImages = (_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) return cb(null, true);
  cb(new AppError(400, 'Only image files are allowed.'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: onlyImages,
});
