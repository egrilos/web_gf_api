import createHttpError from "http-errors";

import { createUser, signUser } from "../services/auth.service.js";
import {
  generateToken,
  isTokenRevoked,
  revokeToken,
  validateToken,
} from "../services/tokens.service.js";

import {
  UserCreateDTO,
  UserDb,
  UserLoginDTO,
  TokenPayload,
} from "../types/index.js";

import { TokenRevokingPayload } from "../types/token.type.js";

export const register = async (req, res, next) => {
  try {
    const { name, username, cpf, email, bio, password, remember } = req.body;

    const regex = /[^0-9]/g;
    const numericCpf = cpf.replace(regex, "");

    const sentUser: UserCreateDTO = {
      name,
      username,
      cpf: numericCpf,
      email,
      bio,
      password,
    };

    // will take care of validation and creating user
    const newUser: UserDb = await createUser(sentUser);

    const accessToken = await generateToken(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_LIFETIME || "15m",
      process.env.ACCESS_TOKEN_SECRET
    );

    // Adding a remember me feature
    if (remember === true) {
      const refreshToken = await generateToken(
        { userId: newUser._id },
        process.env.REFRESH_TOKEN_LIFETIME || "20d",
        process.env.REFRESH_TOKEN_SECRET
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/api/v1/auth/",
        maxAge: 1000 * 60 * 60 * 24 * 20, // 20 days
      });
    }

    res.json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        picture: newUser.picture,
      },
      accessToken: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;

    const sentLogin: UserLoginDTO = {
      email,
      password,
    };

    // will take care of validation and creating user
    const user: UserDb = await signUser(sentLogin);

    // will take care of sending email
    // <------------------------------->
    // HERE
    // <------------------------------->

    const accessToken = await generateToken(
      { userId: user._id },
      process.env.ACCESS_TOKEN_LIFETIME || "15m",
      process.env.ACCESS_TOKEN_SECRET
    );

    // Adding a remember me feature
    if (remember === true) {
      const refreshToken = await generateToken(
        { userId: user._id },
        process.env.REFRESH_TOKEN_LIFETIME || "20d",
        process.env.REFRESH_TOKEN_SECRET
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/api/v1/auth/",
        maxAge: 1000 * 60 * 60 * 24 * 20, // 20 days
      });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        picture: user.picture,
      },
      accessToken: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    console.log(refreshToken);

    if (!refreshToken) {
      throw createHttpError.Unauthorized("Please, login first.");
    }

    const isRevoked = await isTokenRevoked(refreshToken);
    if (isRevoked) {
      throw createHttpError.Unauthorized("Please, login first.");
    }

    const check: any = await validateToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const payload: TokenRevokingPayload = {
      userId: check.userId,
      token: refreshToken,
      expiresAt: check.exp,
    };

    await revokeToken(payload);

    res.clearCookie("refreshToken", { path: "/api/v1/auth/" });

    res.json({ message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    console.log(refreshToken);

    if (!refreshToken) {
      throw createHttpError.Unauthorized("Please, login first.");
    }
    const isRevoked = await isTokenRevoked(refreshToken);
    if (isRevoked) {
      throw createHttpError.Unauthorized("Please, login first.");
    }

    const check: any = await validateToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const accessToken = await generateToken(
      { userId: check.userId },
      process.env.ACCESS_TOKEN_LIFETIME || "15m",
      process.env.ACCESS_TOKEN_SECRET || "30d"
    );

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};
