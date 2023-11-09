import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';
const {
  findOne,
  findOne2,
  createOne,
  findByIdAndUpdate,
} = require('./dbUsers.service');

import { NotAuthorizedError } from '../utils/app-errors';
// const { JWT_SECRET, ACCESS_TOKEN_TTL } = process.env;
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

  const candidate = await findOne('689c88ab-9733-4534-a45f-d65d74aa8b6f');
  if (candidate) {
    throw new Error('No result ID');
  }
  const candidate2 = await findOne('333333ww31233w@i.ua');
  if (candidate2) {
    throw new Error('No result email');
  }
  await createOne({ id, email, password: hashPass, token, links: '[{}]' });
  return { token };
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

  const token = sign({ id: user.id }, String(JWT_SECRET), {
    expiresIn: ACCESS_TOKEN_TTL,
  });

  const updatedUser = await findByIdAndUpdate(user.id, token);
  return updatedUser;
};

export { signUp, signIn };
