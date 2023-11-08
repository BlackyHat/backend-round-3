import { BadRequestError } from '../utils/app-errors';
import { Request, Response, NextFunction } from 'express';

interface NewUser {
  email: string;
  password: string;
}

export const validateAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  function minLength(data: NewUser, length: number) {
    return String(data).length >= length ? true : false;
  }
  function maxLength(data: NewUser, length: number) {
    return String(data).length <= length ? true : false;
  }
  function isEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  const { email, password } = req.body;

  const isEmailValid =
    minLength(email, 3) && maxLength(email, 32) && isEmail(email);
  const isPasswordValid = minLength(password, 6) && maxLength(password, 32);

  if (!isEmailValid || !isPasswordValid) {
    throw new BadRequestError('Email or password is not valid.');
  }

  next();
};
