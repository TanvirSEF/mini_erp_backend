import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

// comma separated origins allowed by cors, * means any
const clientOrigins = (process.env.CLIENT_URL || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const resolveCorsOrigin = () => {
  if (clientOrigins.length === 0 || clientOrigins.includes('*')) return true;
  if (clientOrigins.length === 1) return clientOrigins[0];
  return clientOrigins;
};

export default {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  // avoids nan bcrypt rounds if unset
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || '12',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  // cors origin used by express and socket io
  cors_origin: resolveCorsOrigin(),
};
