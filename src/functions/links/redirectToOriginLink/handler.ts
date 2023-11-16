import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';
import { getOriginLink } from '@/services';
import createShortLink from '@/libs/create-shortLink';

const redirectToOriginLink = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const shortLink = event.pathParameters?.shortLink;
  try {
    if (!shortLink) {
      throw new Error('Error shortLink');
    }

    const host = event.headers.Host;
    const protocol = event.headers['X-Forwarded-Proto'];
    const stage = event.requestContext.stage;
    if (!host) {
      return formatJSONResponse(500, {
        error: "Can't get the current host",
      });
    }

    const shortURL = createShortLink({ host, protocol, stage, shortLink });
    const GSI1PK = 'LINK#'.concat(shortURL);
    const linkData = await getOriginLink(GSI1PK);

    if (!linkData.originalLink) {
      return formatJSONResponse(404, {
        success: 'false',
        error: 'Link not found',
      });
    }

    return {
      statusCode: 302,
      headers: {
        Location: linkData.originalLink,
      },
      body: '',
    };
  } catch (error) {
    return formatJSONResponse(error.statusCode || 500, {
      success: 'false',
      error: error.message,
    });
  }
};

export const main = middyfy(redirectToOriginLink);
