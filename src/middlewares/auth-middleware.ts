const { Request, Response, NextFunction } = require('express');
const jwt = require('jsonwebtoken');
const { findOne } = require('../services');

const { NotAuthorizedError } = require('../utils/app-errors');
const { JWT_SECRET } = process.env;

interface IUser {
  id: string;
  email: string;
  token: string;
  password: string;
}
declare module 'express' {
  interface Request {
    user: IUser;
  }
}
export const authMiddleware = async (
  req: typeof Request,
  _res: typeof Response,
  next: typeof NextFunction
) => {
  const { authorization = '' } = req.headers;
  const [tokenType, token] = authorization.split(' ');

  if (tokenType !== 'Bearer' || !token) {
    next(new NotAuthorizedError(`Not authorized.`));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await findOne(id);

    if (!user || token !== user.token) {
      next(new NotAuthorizedError('Not authorized.'));
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(new NotAuthorizedError(error.message));
  }
};
