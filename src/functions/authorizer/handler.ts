import {
  AuthResponse,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayEventDefaultAuthorizerContext,
  PolicyDocument,
} from 'aws-lambda';
import { JwtPayload, verify } from 'jsonwebtoken';
import { findByID } from '@/services/dbUsers.service';

const { JWT_SECRET } = process.env;

type AuthorizerCallback = (error: string | null, policy?: AuthResponse) => void;

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
  context: APIGatewayEventDefaultAuthorizerContext,
  callback: AuthorizerCallback
) => {
  if (!event.authorizationToken) {
    return callback('Unauthorized');
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    return callback('Unauthorized');
  }

  try {
    const { id } = verify(tokenValue, String(JWT_SECRET)) as JwtPayload;
    const user = await findByID(id);
    if (!user) {
      return callback('Unauthorized');
    }
    if (context) {
      context.userId = id;
    }
    return callback(null, generatePolicy(id, 'Allow', event.methodArn));
  } catch (error) {
    return callback('Unauthorized');
  }
};
