import { APIGatewayProxyResult } from 'aws-lambda';
import { sign } from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import { ulid } from 'ulidx';

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';
import { createOne, findOne } from '@/services/dbUsers.service';
import schema from './schema';

const { JWT_SECRET, TOKEN_TTL } = process.env;

const signUp: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = event.body;

    const userId = ulid();
    const PK = 'USER#'.concat(userId);
    const SK = 'USER#'.concat(userId);
    const GSI1PK = 'USER#'.concat(email);

    const access_token = sign({ userId }, String(JWT_SECRET), {
      expiresIn: TOKEN_TTL,
    });
    const hashPass = await hash(password, 10);

    const candidate = await findOne(GSI1PK);

    if (candidate && candidate.length > 0) {
      return formatJSONResponse(409, {
        success: 'false',
        error: 'Email in use.',
      });
    }
    await createOne({
      PK,
      SK,
      GSI1PK,
      userId,
      email,
      password: hashPass,
      access_token,
    });

    return formatJSONResponse(201, {
      success: 'true',
      data: { access_token },
    });
  } catch (error) {
    return formatJSONResponse(error.statusCode || 500, {
      success: 'false',
      error: error.message,
    });
  }
};

export const main = middyfy(signUp);
