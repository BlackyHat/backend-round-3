import { Request, Response, NextFunction } from 'express';

export default (_req: Request, res: Response, _next: NextFunction) => {
  res
    .status(404)
    .json({ status: 'false', error: 'Oops! Resource not found...' });
};
