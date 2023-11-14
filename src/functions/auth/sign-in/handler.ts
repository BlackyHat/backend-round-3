import { APIGatewayProxyResult } from 'aws-lambda';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';
import { findOne, findByIdAndUpdate } from '@/services/dbUsers.service';
import { validateAuth } from '@/validation/auth.validation';
import schema from './schema';

const { JWT_SECRET, TOKEN_TTL } = process.env;

const signIn: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = event.body;
    validateAuth({ email, password });

    const [user] = await findOne(email);
    if (!user) {
      return formatJSONResponse(401, { error: 'Email or password is wrong' });
    }
    if (!(await compare(password, user.password))) {
      return formatJSONResponse(401, { error: 'Email or password is wrong' });
    }
    const token = sign({ id: user.id }, String(JWT_SECRET), {
      expiresIn: TOKEN_TTL,
    });

    await findByIdAndUpdate(user.id, token);

    return formatJSONResponse(200, {
      success: 'true',
      data: { id: user.id, token },
    });
  } catch (error) {
    return formatJSONResponse(error.statusCode || 500, {
      error: error.message,
    });
  }
};

export const main = middyfy(signIn);
