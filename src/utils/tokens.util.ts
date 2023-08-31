import jwt, { VerifyErrors, SignOptions, Secret } from "jsonwebtoken";
import { logger } from "../configs/logger.config.js";

export const signToken = async (
  payload: any,
  expiresIn: string | number,
  secret: Secret
): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
        { expiresIn } as SignOptions,
        (err: Error | null, token: string | undefined) => {
          if (err) {
            logger.error(err);
            reject(err);
          }
          if (!token) {
            reject(new Error("Token could not be generated"));
          }
          resolve(token);
        }
      );
    });
  } catch (error) {
    logger.error(error);
    throw error; // Rethrow the error to handle it further if needed
  }
};

export const verifyToken = async (
  token: string,
  secret: Secret
): Promise<any> => {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(decoded);
      });
    });
  } catch (error) {
    logger.error(error);
    throw error; // Rethrow the error to handle it further if needed
  }
};
