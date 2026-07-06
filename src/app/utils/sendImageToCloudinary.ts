import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// upload an in-memory buffer (multer memoryStorage) straight to cloudinary
export const sendImageToCloudinary = (
  imageName: string,
  buffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ public_id: imageName }, (error, result) => {
        if (error) reject(error);
        else resolve(result as UploadApiResponse);
      })
      .end(buffer);
  });
};
