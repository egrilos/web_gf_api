import validator from "validator";
import createHttpError from "http-errors";

// Each validation will throw an http error if it fails

// Validate credentials

export const validateName = (name: string) => {
  if (!validator.default.isLength(name, { min: 4, max: 60 })) {
    throw createHttpError.BadRequest(
      "Name should be at least 4 characters and not more than 60 characters."
    );
  }
};

export const validateUsername = (username: string) => {
  if (!validator.default.isLength(username, { min: 4, max: 30 })) {
    throw createHttpError.BadRequest(
      "Username should be at least 4 characters and not more than 30 characters."
    );
  }
};

export const validateEmail = (email: string) => {
  if (!validator.default.isEmail(email)) {
    throw createHttpError.BadRequest("Please enter a valid email.");
  }
};

export const validateCPF = (cpf: string) => {
  if (!validator.default.isLength(cpf, { min: 11, max: 11 })) {
    throw createHttpError.BadRequest("CPF should be exactly 11 characters.");
  }
};

export const validateIsAdult = (isAdult: boolean) => {
  if (typeof isAdult !== "boolean") {
    throw createHttpError.BadRequest("isAdult should be a boolean value.");
  }
};

export const validatePicture = (picture: string, defaultPicture: string) => {
  if (!validator.default.isURL(picture)) {
    return defaultPicture;
  }
  return picture;
};

export const validateBio = (bio: string) => {
  if (!validator.default.isLength(bio, { min: 0, max: 300 })) {
    throw createHttpError.BadRequest(
      "Bio should be at least 0 characters and not more than 300 characters."
    );
  }
};

export const validatePassword = (password: string) => {
  if (!validator.default.isLength(password, { min: 6, max: 120 })) {
    throw createHttpError.BadRequest(
      "Password should be at least 6 characters and not more than 120 characters."
    );
  }
};

// Format credentials
export const formatCpf = (cpf: string) => {
  const numericDigits = cpf.replace(/\D/g, ""); // Remove all non-numeric characters
  const trimmedNumericString = numericDigits.trim();
  console.log(trimmedNumericString);
  return trimmedNumericString;
};
