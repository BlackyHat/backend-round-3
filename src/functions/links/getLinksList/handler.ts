import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';
import { getUserLinksList } from '@/services';

const getLinksList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = event?.requestContext?.authorizer?.principalId;
  try {
    const linksList = await getUserLinksList(userId);
    return formatJSONResponse(200, {
      success: 'true',
      data: {
        id: userId,
        linksCount: linksList?.length,
        linksList,
      },
    });
  } catch (error) {
    return formatJSONResponse(error.statusCode || 500, {
      success: 'false',
      error: error.message,
    });
  }
};

export const main = middyfy(getLinksList);
