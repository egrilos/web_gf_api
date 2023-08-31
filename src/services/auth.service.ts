import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import { UserModel } from "../models/index.js";
import {
  validateName,
  validateUsername,
  validateCPF,
  validateEmail,
  validatePicture,
  validateBio,
  validatePassword,
  formatCpf,
} from "../utils/credentials.util.js";

import {
  UserDb,
  UserCreateDTO,
  UserLoginDTO,
  UserResponseDTO,
} from "../types/index.js";

const { DEFAULT_PICTURE } = process.env;

// functions
export const createUser = async (newUser: UserCreateDTO): Promise<UserDb> => {
  const { name, username, email, cpf, bio, password } = newUser;

  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }

  // Validate credentials
  validateName(name);
  validateUsername(username);
  validateEmail(email);
  validateCPF(cpf);
  validateBio(bio);
  validatePassword(password);

  // Each validation will throw an http error if it fails and will stop the function execution
  const userExists = await UserModel.findOne({
    $or: [{ email: email }, { cpf: cpf }],
  });
  if (userExists) {
    throw createHttpError.Conflict("User already exists.");
  }

  // create user
  const createdUser: UserDb = await new UserModel({
    name,
    username,
    email,
    cpf,
    isAdult: false,
    picture: DEFAULT_PICTURE,
    bio,
    password,
  }).save();

  return createdUser;
};

export const signUser = async (loginUser: UserLoginDTO): Promise<UserDb> => {
  const { email, password } = loginUser;

  // validate credentials
  if (!email || !password) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }

  validatePassword(password);
  validateEmail(email);

  // find user
  const foundUser: UserDb = await UserModel.findOne({ email });
  if (!foundUser) {
    throw createHttpError.NotFound("Invalid credentials.");
  }

  // compare password
  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordCorrect) {
    throw createHttpError.Unauthorized("Invalid credentials.");
  }

  // return user
  return foundUser;
};
