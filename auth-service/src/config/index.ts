import dotenv from "dotenv";

dotenv.config();

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,

  mongodb_url: process.env.MONGODB_URL,

  redis_database_url: process.env.REDIS_DATABASE_URL,

  smtp_host: process.env.SMTP_HOST,
  smtp_port: Number(process.env.SMTP_PORT) || 587,
  smtp_service: process.env.SMTP_SERVICE,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,

  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,

  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,

  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,

  jwt_reset_token_secret: process.env.JWT_RESET_TOKEN_SECRET,
  jwt_reset_token_expires_in: process.env.JWT_RESET_TOKEN_EXPIRES_IN,

  user_client_url: process.env.USER_CLIENT_URL,
};
