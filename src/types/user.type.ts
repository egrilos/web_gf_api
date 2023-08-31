// Data retrieved from DB
export type UserDb = {
  _id: string;
  name: string;
  username: string;
  email: string;
  cpf: string;
  picture: string;
  bio: string;
  password: string;
  isAdult: boolean;
  createdAt: string;
  updatedAt: string;
};

// Data sent to DB for registration
export type UserCreateDTO = {
  name: string;
  username: string;
  email: string;
  cpf: string;
  bio: string;
  password: string;
};

// Data sent to DB for login
export type UserLoginDTO = {
  email: string;
  password: string;
};

// Data sent to client
export type UserResponseDTO = {
  _id: string;
  name: string;
  username: string;
  email: string;
  cpf: string;
  picture: string;
  bio: string;
  isAdult: boolean;
  createdAt: string;
  updatedAt: string;
};
