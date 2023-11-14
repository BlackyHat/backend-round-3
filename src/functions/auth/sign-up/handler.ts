import { APIGatewayProxyResult } from 'aws-lambda';
import { sign } from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import { v4 } from 'uuid';

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';
import { findOne, createOne } from '@/services/dbUsers.service';
import schema from './schema';

const { JWT_SECRET, TOKEN_TTL } = process.env;

const signUp: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = event.body;
    const id = v4();
    const token = sign({ id }, String(JWT_SECRET), {
      expiresIn: TOKEN_TTL,
    });
    const hashPass = await hash(password, 10);

    const candidate = await findOne(email);
    if (candidate && candidate.length > 0) {
      return formatJSONResponse(409, { error: 'Email in use.' });
    }
    await createOne({ id, email, password: hashPass, token });
    return formatJSONResponse(201, {
      success: 'true',
      data: { token },
    });
  } catch (error) {
    return formatJSONResponse(error.statusCode || 500, {
      error: error.message,
    });
  }
};

export const main = middyfy(signUp);
