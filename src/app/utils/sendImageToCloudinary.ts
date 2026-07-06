import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';
import fs from 'fs';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (imageName: string, path: string): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, { public_id: imageName }, (error, result) => {
      // remove local file after upload
      fs.unlinkSync(path);
      if (error) reject(error);
      resolve(result);
    });
  });
};
