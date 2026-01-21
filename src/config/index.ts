import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,

  redis_database_url: process.env.REDIS_DATABASE_URL,

  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,

  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,

  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,

  jwt_reset_token_secret: process.env.JWT_RESET_TOKEN_SECRET,
  jwt_reset_token_expires_in: process.env.JWT_RESET_TOKEN_EXPIRES_IN,

  user_service_url: process.env.USER_SERVICE_URL,
  internal_service_secret: process.env.INTERNAL_SERVICE_SECRET,

  smtp_host: process.env.SMTP_HOST,
  smtp_port: Number(process.env.SMTP_PORT) || 587,
  smtp_service: process.env.SMTP_SERVICE,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,

  allowed_origins: process.env.ALLOWED_ORIGINS,

  user_client_url: process.env.USER_CLIENT_URL,
  seller_client_url: process.env.SELLER_CLIENT_URL,
};
