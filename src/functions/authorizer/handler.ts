import {
  AuthResponse,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayEventDefaultAuthorizerContext,
  PolicyDocument,
} from 'aws-lambda';
import { JwtPayload, verify } from 'jsonwebtoken';
import { findByID } from '@/services/dbUsers.service';
import { formatJSONResponse } from '@/libs/api-gateway';

const { JWT_SECRET } = process.env;

const generatePolicy = (
  principalId: string,
  effect: string | null,
  resource: string | null
) => {
  const authResponse: AuthResponse = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [],
    },
  };

  if (effect && resource) {
    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

export const authorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: APIGatewayEventDefaultAuthorizerContext
) => {
  if (!event.authorizationToken) {
    throw new Error('Unauthorized');
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    throw new Error('Unauthorized');
  }

  try {
    const { userId } = verify(tokenValue, String(JWT_SECRET)) as JwtPayload;
    const user = await findByID(userId);
    if (!user) {
      throw new Error('Unauthorized');
    }
    if (context) {
      context.userId = userId;
    }
    return generatePolicy(userId, 'Allow', event.methodArn);
  } catch (error) {
    return formatJSONResponse(error.statusCode || 401, {
      error: error.message || 'Unauthorized',
    });
  }
};
