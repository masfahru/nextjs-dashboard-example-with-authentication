import argon2 from "argon2";

export const argon2idConfig = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export const hashPassword = (password: string) =>
  argon2.hash(password, argon2idConfig);

export const verifyPassword = (hashed: string, password: string) =>
  argon2.verify(hashed, password);

// import bcrypt from 'bcrypt';

// export const hashPassword = (password: string) => bcrypt.hash(password, 10);

// export const verifyPassword = (hashed: string, password: string) => bcrypt.compare(password, hashed)
