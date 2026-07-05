import multer from 'multer';
import path from 'path';
import fs from 'fs';

fs.mkdirSync(process.cwd() + '/uploads/', { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });
