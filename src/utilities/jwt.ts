import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const { JWT_SECRET, TOKEN_EXPIRY, REFRESH_JWT_SECRET, REFRESH_TOKEN_EXPIRY } =
  process.env;

export const signJWT = (payload: { email: string; id: string }) => {
  const token = jwt.sign(payload, String(JWT_SECRET), {
    expiresIn: Number(TOKEN_EXPIRY),
  });
  return token;
};
export const signRefreshJWT = (payload: { email: string; id: string }) => {
  const refreshToken = jwt.sign(payload, String(REFRESH_JWT_SECRET), {
    expiresIn: Number(REFRESH_TOKEN_EXPIRY),
  });
  return refreshToken;
};

export const decodeJWT = (token: string): any => {
  const decoded = jwt.verify(token, String(JWT_SECRET));
  return decoded;
};
