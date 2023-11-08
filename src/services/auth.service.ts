import { compare } from 'bcryptjs';
import { findOne, createOne, findByIdAndUpdate } from '../db';
import { sign } from 'jsonwebtoken';

import { NotAuthorizedError, ConflictError } from '../utils/app-errors';
const { JWT_SECRET, ACCESS_TOKEN_TTL } = process.env;

interface NewUser {
  email: string;
  password: string;
}

const signUp = async (credentials: NewUser) => {
  const { email, password } = credentials;
  const candidate = await findOne({ email });

  if (candidate) {
    throw new ConflictError('Email in use.');
  }

  const { id } = await createOne({ email, password });

  const access_token = sign({ id }, String(JWT_SECRET), {
    expiresIn: ACCESS_TOKEN_TTL,
  });

  const refresh_token = sign({ id }, String(JWT_SECRET));

  const updatedUser = await findByIdAndUpdate(id, {
    access_token,
    refresh_token,
  });

  return updatedUser;
};

const signIn = async (credentials) => {
  const { email, password } = credentials;

  const user = await findOne({ email });

  if (!user) {
    throw new NotAuthorizedError('Email or password is wrong');
  }

  if (!(await compare(password, user.password))) {
    throw new NotAuthorizedError('Email or password is wrong');
  }

  const access_token = sign({ id: user.id }, String(JWT_SECRET), {
    expiresIn: ACCESS_TOKEN_TTL,
  });

  const updatedUser = await findByIdAndUpdate(user.id, { access_token });
  return updatedUser;
};

export { signUp, signIn };
