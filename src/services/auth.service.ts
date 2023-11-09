import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';

import { v4 } from 'uuid';
import {
  findOne,
  createOne,
  findByIdAndUpdate,
  IUser,
} from './dbUsers.service';

import { ConflictError, NotAuthorizedError } from '../utils/app-errors';
// const { JWT_SECRET, ACCESS_TOKEN_TTL } = process.env;
console.log('process.env', process.env);
const JWT_SECRET = '!@#$%^&*()';
const ACCESS_TOKEN_TTL = '1d';

interface NewUser {
  email: string;
  password: string;
}

const signUp = async (credentials: NewUser) => {
  const { email, password } = credentials;

  const id = v4();
  const token = sign({ id }, String(JWT_SECRET), {
    expiresIn: ACCESS_TOKEN_TTL,
  });
  const hashPass = await hash(password, 10);

  const candidate = await findOne(email);
  if (candidate && candidate.length > 0) {
    throw new ConflictError('Email in use.');
  }

  await createOne({ id, email, password: hashPass, token });
  return { token };
};

const signIn = async (
  credentials: Pick<IUser, 'email' | 'password'>
): Promise<IUser> => {
  const { email, password } = credentials;
  const [user] = await findOne(email);
  if (!user) {
    throw new NotAuthorizedError('Email or password is wrong');
  }

  if (!(await compare(password, user.password))) {
    throw new NotAuthorizedError('Email or password is wrong');
  }

  const token = sign({ id: user.id }, String(JWT_SECRET), {
    expiresIn: ACCESS_TOKEN_TTL,
  });

  const response = await findByIdAndUpdate(user.id, token);
  return response?.Attributes as IUser;
};

export { signUp, signIn };
