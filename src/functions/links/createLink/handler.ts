import { v4 } from 'uuid';

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';
import { createUserLink } from '@/services';
import createShortLink from '@/utils/create-shortLink';

import { ILink, LinkLifetime } from '@/models/link.model';
import schema from './schema';

const createLink: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { link, lifetime } = event.body;
    const userId = event?.requestContext?.authorizer?.principalId;

    const host = event.headers.Host;
    const protocol = event.headers['X-Forwarded-Proto'];
    const stage = event.requestContext.stage;

    if (!host) {
      return formatJSONResponse(500, {
        error: "Can't get the current host",
      });
    }
    const shortLink = createShortLink({ host, protocol, stage });
    const expiredAt =
      lifetime === LinkLifetime.ONE_TIME
        ? LinkLifetime.ONE_TIME
        : parseInt(lifetime) * 24 * 3600 * 1000 + Date.now();

    const linkData: ILink = {
      id: v4(),
      userId,
      shortLink,
      originalLink: link,
      isActive: true,
      createdAt: new Date().getTime(),
      expiredAt,
      visited: 0,
    };

    await createUserLink(linkData);
    return formatJSONResponse(200, {
      success: 'true',
      data: linkData,
    });
  } catch (error) {
    return formatJSONResponse(error.statusCode || 500, {
      error: error.message,
    });
  }
};

export const main = middyfy(createLink);
