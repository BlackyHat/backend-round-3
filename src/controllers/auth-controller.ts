import { signUp, signIn } from '../services';
import { NextFunction, Request, Response } from 'express';

const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, token } = await signIn(req.body);
    res.status(200).json({
      success: 'true',
      data: { id, token },
    });
  } catch (error) {
    next(error);
  }
};

const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = await signUp(req.body);

    res.status(201).json({
      success: 'true',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

export { signInController, signUpController };
