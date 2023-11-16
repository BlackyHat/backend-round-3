import { APIGatewayProxyResult } from 'aws-lambda';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';
import { findOne, findByIdAndUpdate } from '@/services/dbUsers.service';
import schema from './schema';

const { JWT_SECRET, TOKEN_TTL } = process.env;

const signIn: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = event.body;
    const emailIdx = 'USER#'.concat(email);

    const [user] = await findOne(emailIdx);
    if (!user) {
      throw new Error('Email or password is wrong');
    }
    if (!(await compare(password, user.password))) {
      throw new Error('Email or password is wrong');
    }
    const access_token = sign({ userId: user.userId }, String(JWT_SECRET), {
      expiresIn: TOKEN_TTL,
    });

    await findByIdAndUpdate(user.userId, access_token);

    return formatJSONResponse(200, {
      success: 'true',
      data: { id: user.id, access_token },
    });
  } catch (error) {
    return formatJSONResponse(error.statusCode || 500, {
      success: 'false',
      error: error.message,
    });
  }
};

export const main = middyfy(signIn);
