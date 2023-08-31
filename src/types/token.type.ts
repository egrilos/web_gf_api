export type TokenPayload = {
  userId: string;
  iat: number;
  exp: number;
};

export type TokenRevokingPayload = {
  userId: string;
  token: string;
  expiresAt: number;
};
