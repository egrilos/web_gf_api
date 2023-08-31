import { signToken, verifyToken } from "../utils/tokens.util.js";
import { RevokedToken } from "../models/index.js";
import { TokenRevokingPayload } from "../types/index.js";
import jwt from "jsonwebtoken";
import { NextFunction } from "express"; // If you're using Express.js
import createHttpError from "http-errors"; // Assuming you're using the 'http-errors' package

export const generateToken = async (
  payload: object,
  expiresIn: string | number,
  secret: jwt.Secret
): Promise<string> => {
  const token = await signToken(payload, expiresIn, secret);
  return token;
};

export const validateToken = async (
  token: string,
  secret: jwt.Secret
): Promise<object> => {
  const decoded = await verifyToken(token, secret);
  return decoded;
};

export const revokeToken = async (
  refreshTokenPayload: TokenRevokingPayload
): Promise<void> => {
  const revokedToken = new RevokedToken(refreshTokenPayload);
  await revokedToken.save();
};

export const isTokenRevoked = async (token: string): Promise<boolean> => {
  const isRevoked = await RevokedToken.exists({ token });
  if (isRevoked) {
    return true;
  } else {
    return false;
  }
};

export const getAccessToken = async (
  bearerToken: string | null,
  next: NextFunction
): Promise<object | string> => {
  if (!bearerToken) return next(createHttpError.Unauthorized());
  const token = bearerToken.split(" ")[1];
  return await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as jwt.Secret);
};
