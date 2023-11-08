const { AppError } = require('../utils/app-errors');
import { Request, Response, NextFunction } from 'express';

const userController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, email } = req.user;
    res.status(200).json({ success: 'true', data: { id, email } });
  } catch (error) {
    next(new AppError({ status: 500, message: error.message }));
  }
};

export { userController };
