import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';
import { deactivateUserLink } from '@/services';

const deactivateLink = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = event?.requestContext?.authorizer?.principalId;
  const linkId = event.pathParameters?.linkId;
  try {
    if (!linkId) {
      throw new Error('Error to deactivate link');
    }
    const linkData = await deactivateUserLink(userId, linkId);
    return formatJSONResponse(200, {
      success: 'true',
      data: linkData,
    });
  } catch (error) {
    return formatJSONResponse(error.statusCode || 500, {
      success: 'false',
      error: error.message,
    });
  }
};

export const main = middyfy(deactivateLink);
