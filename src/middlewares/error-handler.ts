import { NextFunction, Request, Response } from 'express';
import { AppError } from 'src/utils/app-errors';

export default (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(err.status || 500).json({ status: 'false', error: err.message });
};
